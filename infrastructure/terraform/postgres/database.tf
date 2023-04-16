locals {
  db_username = "admin"
  db_password = "admin"
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
