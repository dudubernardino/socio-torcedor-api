resource "google_secret_manager_secret_iam_member" "secret_binding" {
  project   = data.google_project.project.number
  for_each  = data.google_secret_manager_secret.secret_lookup
  secret_id = replace(each.value.name, "/\\/versions.*/", "")
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

data "google_secret_manager_secret" "secret_lookup" {
  project   = var.project_id
  for_each  = var.secrets
  secret_id = each.value
}

data "google_project" "project" {
  project_id = var.project_id
}
