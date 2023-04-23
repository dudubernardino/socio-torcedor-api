// Required for the private instances to go out to the internet
module "cloud_nat" {
  source  = "terraform-google-modules/cloud-nat/google"
  version = "2.1.0"
  project_id = var.project
  region = var.region
  network = var.network

  create_router = true
  router = "nat-gateway"
}
