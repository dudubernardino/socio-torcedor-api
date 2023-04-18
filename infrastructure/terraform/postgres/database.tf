locals {
  db_username = "superadmin"
  db_password = random_password.password.result
}

resource "random_string" "username" {
  length  = 16
  special = false
}

resource "random_password" "password" {
  length  = 16
  special = true
}

module "postgresql" {
  source  = "GoogleCloudPlatform/sql-db/google//modules/postgresql"
  version = "14.0.1"

  name                 = "${var.project_id}-db"
  random_instance_name = true
  project_id           = var.project_id
  database_version     = "POSTGRES_14"
  region               = var.region

  // Master configurations
  tier = "db-f1-micro"
  zone = var.zone

  ip_configuration = {
    ipv4_enabled       = false
    require_ssl        = false
    private_network    = module.vpc_module.network_self_link
    allocated_ip_range = google_compute_global_address.private_ip_address.name
    authorized_networks = [
    ]
  }

  deletion_protection = var.deletion_protection

  database_flags = []

  user_labels = {
  }

  db_name      = "${var.project_id}-db"
  db_charset   = "UTF8"
  db_collation = "en_US.UTF8"

  user_name     = local.db_username
  user_password = local.db_password

  depends_on = [
    google_service_networking_connection.private_vpc_connection
  ]

  create_timeout = "30m"
}

resource "google_secret_manager_secret" "postgress_password" {
  project   = var.project_id
  secret_id = "POSTGRES_PASSWORD"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
