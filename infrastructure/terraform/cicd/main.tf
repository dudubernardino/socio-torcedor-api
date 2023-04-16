resource "google_cloudbuild_trigger" "cicd_backend_trigger" {
  project = var.project_id
  name    = "socio-torcedor-backend-merge"

  github {
    name  = "socio-torcedor-api"
    owner = "dudubernardino"

    push {
      branch       = "^main$"
      invert_regex = false
    }
  }

  service_account = data.google_service_account.terraform_service_account.id
  filename        = "ci/cloudbuild-backend.yaml"
}
