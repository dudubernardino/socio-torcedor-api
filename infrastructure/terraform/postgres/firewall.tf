
resource "google_compute_firewall" "postgres_egress" {
  name        = "${var.postgres_network_name}-postgres-egress"
  description = "Allow traffic internally for postgres"
  network     = var.postgres_network_name
  project     = var.project_id

  direction = "EGRESS"

  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }

  allow {
    protocol = "udp"
    ports    = ["5432"]
  }

  allow {
    protocol = "icmp"
  }

  target_tags        = []
  destination_ranges = module.vpc_module.subnets_ips

  depends_on = [
    module.vpc_module
  ]
}
