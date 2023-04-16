resource "google_storage_bucket" "postgres" {
  project       = var.project_id
  name          = "${var.project_id}-postgres"
  location      = var.region
  force_destroy = false
}

resource "google_storage_bucket_object" "internal_ip" {
  name    = "postgres-internal-ip"
  content = module.postgresql.private_ip_address
  bucket  = google_storage_bucket.postgres.id
}

resource "google_storage_bucket_object" "username" {
  name    = "postgres-username"
  content = local.db_username
  bucket  = google_storage_bucket.postgres.id
}

resource "google_storage_bucket_object" "certificate" {
  name    = "postgres-certificate"
  content = module.postgresql.instance_server_ca_cert[0].cert
  bucket  = google_storage_bucket.postgres.id
}

resource "google_storage_bucket_object" "vpc_access_connector" {
  name    = "vpc-access-connector"
  content = google_vpc_access_connector.vpc_access_conn.name
  bucket  = google_storage_bucket.postgres.id
}
