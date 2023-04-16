resource "google_service_account" "cloud_run_service_account" {
  account_id   = "${var.service_application_name}-svc"
  display_name = "${var.service_application_name} service account"
  project      = var.project_id

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_project_iam_member" "backend_cloudrun_invoker" {
  project = var.project_id
  role    = "roles/run.invoker"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

#########################
####### Cloud SQL #######
#########################

resource "google_project_iam_member" "backend_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}
