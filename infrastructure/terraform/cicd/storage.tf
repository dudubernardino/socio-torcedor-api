resource "google_storage_bucket" "ops_merge_build_logs" {
  project       = "socio-torcedor-api"
  name          = "socio-torcedor-api-merge-build-logs"
  location      = "US-CENTRAL1"
  force_destroy = true

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "ops_pr_build_logs" {
  project       = "socio-torcedor-api"
  name          = "socio-torcedor-api-pr-build-logs"
  location      = "US-CENTRAL1"
  force_destroy = true

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "dev_branch_build_logs" {
  project       = "socio-torcedor-api"
  name          = "socio-torcedor-api-branch-build-logs"
  location      = "US-CENTRAL1"
  force_destroy = true

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "cicd_merge_build_logs" {
  project       = "socio-torcedor-api"
  name          = "socio-torcedor-api-cicd-merge-build-logs"
  location      = "US-CENTRAL1"
  force_destroy = true

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}


resource "google_storage_bucket" "cicd_pr_build_logs" {
  project       = "socio-torcedor-api"
  name          = "socio-torcedor-api-cicd-pr-build-logs"
  location      = "US-CENTRAL1"
  force_destroy = true

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}
