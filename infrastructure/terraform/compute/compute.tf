resource "google_compute_instance" "bastion_instance_sql_access" {
  project      = var.project
  name         = "bastion-sql"
  machine_type = "e2-micro"
  zone         = var.zone

  tags = ["ssh"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
  
  network_interface {
    network = var.network
    subnetwork = var.subnet
  }

  metadata_startup_script = file("${path.module}/startup.sh")

  service_account {
    email  = google_service_account.bastion_sa.email
    scopes = ["cloud-platform"]
  }
}

