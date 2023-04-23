
resource "google_compute_firewall" "iap_ingress" {
  name        = "bastion-iap-ingress"
  description = "Allow traffic to bastion throught iap"
  network     = var.network
  project     = var.project

  direction = "INGRESS"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  allow {
    protocol = "icmp"
  }

  target_tags        = ["ssh"]
  source_ranges      = ["35.235.240.0/20"]

}