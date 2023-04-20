terraform {
  backend "gcs" {
    bucket = "socio-torcedor-terraform-ops"
    prefix = "state-base"
  }
  required_providers {
    google      = ">= 3.43, < 5.0"
    google-beta = ">= 3.43, < 5.0"
  }
}


provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

module "project_ops" {
  source  = "terraform-google-modules/project-factory/google//modules/project_services"
  version = "~> 14.1"

  project_id = var.project_id

  activate_apis = [
    "iam.googleapis.com",
    "run.googleapis.com",
    "admin.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "vpcaccess.googleapis.com",
    "servicenetworking.googleapis.com",
    "servicecontrol.googleapis.com",
    "servicemanagement.googleapis.com",
    "secretmanager.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
    "container.googleapis.com"
  ]
}

module "service_accounts" {
  source     = "./service_accounts"
  project_id = var.project_id

  depends_on = [
    module.project_ops
  ]
}

module "ci_cd" {
  source     = "./cicd"
  project_id = var.project_id

  depends_on = [
    module.service_accounts
  ]
}

module "artifact_registry" {
  source     = "./artifact_registry"
  project_id = var.project_id

  depends_on = [
    module.ci_cd
  ]
}

module "postgres" {
  source              = "./postgres"
  project_id          = var.project_id
  region              = var.region
  zone                = var.zone
  deletion_protection = false

  depends_on = [
    module.service_accounts
  ]
}

module "cloud_run_service" {
  source                   = "./cloud_run"
  project_id               = var.project_id
  docker_image_name        = var.docker_image_name
  service_application_name = var.service_application_name
  container_port           = 3000
  region                   = var.region
  connect_database         = true
  enable_secret_access     = true
  secrets = [
    "POSTGRES_PASSWORD",
    "JWT_SECRET",
    "JWT_EXPIRATION_TIME",
    "SUPER_ADMIN_NAME",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_SECRET",
    "SUPER_ADMIN_TAX_ID",
    "MERCADO_PAGO_PUBLIC_KEY",
    "MERCADO_PAGO_ACCESS_TOKEN",
    "SG_TOKEN"
  ]

  depends_on = [
    module.postgres
  ]
}

# # Creating and executing Cloud Run Jobs are still not in terrafom :(
# # https://github.com/hashicorp/terraform-provider-google/issues/11743
# module "gcloud" {
#   source  = "terraform-google-modules/gcloud/google"
#   version = "3.1.1"

#   platform              = "linux"
#   additional_components = ["beta"]

#   create_cmd_body = "beta run jobs create ${var.project_id}-migration --project=${var.project_id} --set-secrets=POSTGRES_PASSWORD=POSTGRES_PASSWORD:latest --set-env-vars=POSTGRES_DB=${var.project_id}-db,POSTGRES_USER=superadmin,POSTGRES_HOST=${module.postgres.postgres_internal_ip},POSTGRES_PORT=5432 --vpc-connector=${module.postgres.vpc_access_connector} --image=us-central1-docker.pkg.dev/socio-torcedor-api/socio-torcedor/migration:latest --region=${var.region} --service-account=serviceAccount:${module.service_accounts.email} --memory=1024Mi"
#   # destroy_cmd_body = "beta run jobs delete ${each.key}-migration --project=${each.key} --region=${var.region} --quiet && sleep 60"

#   depends_on = [
#     module.cloud_run_service
#   ]
# }

resource "null_resource" "cloud_run_job" {
  # Configuração do provisioner para executar o comando gcloud
  provisioner "local-exec" {
    command = "gcloud beta run jobs create ${var.project_id}-migration --project=${var.project_id} --set-secrets=POSTGRES_PASSWORD=POSTGRES_PASSWORD:latest --set-env-vars=POSTGRES_DB=${var.project_id}-db,POSTGRES_USER=superadmin,POSTGRES_HOST=${module.postgres.postgres_internal_ip},POSTGRES_PORT=5432 --vpc-connector=${module.postgres.vpc_access_connector} --image=us-central1-docker.pkg.dev/socio-torcedor-api/socio-torcedor/migration:latest --region=${var.region} --service-account=cloud-run-job@socio-torcedor-api.iam.gserviceaccount.com --memory=1024Mi"
  }

  depends_on = [
    module.postgres
  ]
}
