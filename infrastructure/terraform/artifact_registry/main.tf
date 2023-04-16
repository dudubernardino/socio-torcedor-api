resource "google_artifact_registry_repository" "registry" {
  provider      = google-beta
  project       = var.project_id
  location      = var.region
  repository_id = "socio-torcedor"
  description   = "Socio Torcedor Docker Images"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository_iam_member" "member" {
  provider   = google-beta
  project    = google_artifact_registry_repository.registry.project
  location   = google_artifact_registry_repository.registry.location
  repository = google_artifact_registry_repository.registry.repository_id
  role       = "roles/artifactregistry.admin"
  member     = "serviceAccount:${data.google_service_account.terraform_service_account.email}"
}
