resource "google_service_account" "bastion_sa" {
  account_id   = "bastion"
  display_name = "Bastion Service Account"
  project      = var.project
}
