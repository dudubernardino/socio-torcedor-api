terraform {
  backend "gcs" {
    bucket = "socio-torcedor-terraform-ops"
    prefix = "state-base"
  }
  required_providers {
    google      = ">= 3.43, < 5.0"
    google-beta = ">= 3.43, < 5.0"
  }
}


provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

module "project_ops" {
  source  = "terraform-google-modules/project-factory/google//modules/project_services"
  version = "~> 14.1"

  project_id = var.project_id

  activate_apis = [
    "iam.googleapis.com",
    "run.googleapis.com",
    "admin.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "vpcaccess.googleapis.com",
    "servicenetworking.googleapis.com",
    "servicecontrol.googleapis.com",
    "servicemanagement.googleapis.com",
    "secretmanager.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
    "container.googleapis.com"
  ]
}

module "service_accounts" {
  source     = "./service_accounts"
  project_id = var.project_id

  depends_on = [
    module.project_ops
  ]
}

module "ci_cd" {
  source     = "./cicd"
  project_id = var.project_id

  depends_on = [
    module.service_accounts
  ]
}

module "artifact_registry" {
  source     = "./artifact_registry"
  project_id = var.project_id

  depends_on = [
    module.ci_cd
  ]
}

module "postgres" {
  source              = "./postgres"
  project_id          = var.project_id
  region              = var.region
  zone                = var.zone
  deletion_protection = false

  depends_on = [
    module.service_accounts
  ]
}

module "cloud_run_service" {
  source                   = "./cloud_run"
  project_id               = var.project_id
  docker_image_name        = var.docker_image_name
  service_application_name = var.service_application_name
  container_port           = 3000
  region                   = var.region
  connect_database         = true
  enable_secret_access     = true
  email                    = module.service_accounts.email
  secrets = [
    "POSTGRES_PASSWORD",
    "JWT_SECRET",
    "JWT_EXPIRATION_TIME",
    "SUPER_ADMIN_NAME",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_SECRET",
    "SUPER_ADMIN_TAX_ID",
    "MERCADO_PAGO_PUBLIC_KEY",
    "MERCADO_PAGO_ACCESS_TOKEN",
    "SG_TOKEN"
  ]

  depends_on = [
    module.postgres
  ]
}




