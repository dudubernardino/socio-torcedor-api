# Create the Cloud Run service

locals {
  project_config = yamldecode(file(pathexpand("../project/${var.project_id}.yaml")))
  autoscalling_annotations_mapping = {
    "max_scale"         = "autoscaling.knative.dev/maxScale",
    "min_scale"         = "autoscaling.knative.dev/minScale",
    "scale_down_delay"  = "autoscaling.knative.dev/scale-down-delay",
    "startup_cpu_boost" = "run.googleapis.com/startup-cpu-boost",
    "cpu_throttling"    = "run.googleapis.com/cpu-throttling",
  }

  environment_variables    = tomap({ for key, value in local.project_config.environment_vars : key => value })
  autoscalling_annotations = tomap({ for key, value in coalesce(try(local.project_config.default_autoscalling_config, {}), {}) : local.autoscalling_annotations_mapping[key] => value })
}
resource "google_cloud_run_service" "run_service" {
  name     = var.service_application_name
  location = var.region
  project  = var.project_id

  template {
    spec {
      service_account_name = google_service_account.cloud_run_service_account.email
      containers {
        image = var.docker_image_name

        ports {
          container_port = var.container_port
        }

        resources {
          limits = {
            "cpu"    = var.cpu_limit
            "memory" = var.mem_limit
          }
        }

        dynamic "env" {
          for_each = var.connect_database ? merge(tomap({
            "POSTGRES_HOST" = data.google_storage_bucket_object_content.postgres_internal_ip.content
            "POSTGRES_PORT" : "5432"
            "POSTGRES_USER" = data.google_storage_bucket_object_content.postgres_username.content
            "POSTGRES_DB"   = "${var.project_id}-db"
            "DB_SSL_CA_CRT" = data.google_storage_bucket_object_content.postgres_certificate.content
            }), local.environment_variables,
            tomap({
              "SERVICE_NAME" : var.service_application_name
          })) : merge(local.environment_variables)
          content {
            name  = env.key
            value = env.value
          }
        }

        dynamic "env" {
          for_each = data.google_secret_manager_secret.secret_lookup
          content {
            name = env.key
            value_from {
              secret_key_ref {
                name = env.key
                key  = "latest"
              }
            }
          }
        }
      }

      container_concurrency = var.container_concurrency
      timeout_seconds       = var.timeout_seconds
    }

    metadata {
      annotations = var.connect_database || var.connect_vpc ? merge(tomap({
        "run.googleapis.com/vpc-access-connector" = data.google_storage_bucket_object_content.vpc_access_connector.content,
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
      }), local.autoscalling_annotations, var.cloud_run_annotations) : merge(local.autoscalling_annotations, var.cloud_run_annotations)
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }


}

data "google_storage_bucket" "postgres" {
  name = "${var.project_id}-postgres"
}

data "google_storage_bucket_object_content" "postgres_internal_ip" {
  name   = "postgres-internal-ip"
  bucket = data.google_storage_bucket.postgres.id
}

data "google_storage_bucket_object_content" "postgres_username" {
  name   = "postgres-username"
  bucket = data.google_storage_bucket.postgres.id
}

data "google_storage_bucket_object_content" "postgres_certificate" {
  name   = "postgres-certificate"
  bucket = data.google_storage_bucket.postgres.id
}

data "google_storage_bucket_object_content" "vpc_access_connector" {
  name   = "vpc-access-connector"
  bucket = data.google_storage_bucket.postgres.id
}

data "google_iam_policy" "iam_policy" {
  binding {
    role    = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_service_iam_policy" "iam_policy" {
  location = google_cloud_run_service.run_service.location
  service  = google_cloud_run_service.run_service.name

  policy_data = data.google_iam_policy.iam_policy.policy_data
}


