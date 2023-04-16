locals {
  subnet_01 = "${var.postgres_network_name}-subnet-01"
}

module "vpc_module" {
  source  = "terraform-google-modules/network/google"
  version = "6.0.0"

  project_id   = var.project_id
  network_name = var.postgres_network_name
  routing_mode = "REGIONAL"

  subnets = [
    {
      subnet_name           = "${local.subnet_01}"
      subnet_ip             = var.postgres_network_cidr_range
      subnet_region         = var.region
      subnet_private_access = "true"
      subnet_flow_logs      = "true"
    }
  ]
}

resource "google_vpc_access_connector" "vpc_access_conn" {
  name          = var.postgres_vpcconn_name
  region        = var.region
  ip_cidr_range = var.postgres_vpcconn_cidr_range
  network       = module.vpc_module.network_name
  project       = var.project_id
  depends_on = [
    module.vpc_module
  ]
}

resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-address"
  project       = var.project_id
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = module.vpc_module.network_name
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network = module.vpc_module.network_self_link
  service = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [
    google_compute_global_address.private_ip_address.name,
  ]
}
