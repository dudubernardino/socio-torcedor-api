data "google_service_account" "terraform_service_account" {
  account_id = "${var.project_id}-terraform"
  project    = var.project_id
}
