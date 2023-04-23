resource "google_project_iam_member" "bastion_sql_client" {
  project = var.project
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.bastion_sa.email}"
}