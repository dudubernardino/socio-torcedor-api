resource "google_secret_manager_secret_version" "postgress_password_version" {
  secret      = google_secret_manager_secret.postgress_password.id
  secret_data = local.db_password
}

