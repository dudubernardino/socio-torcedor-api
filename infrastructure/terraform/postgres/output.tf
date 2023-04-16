output "postgres_internal_ip" {
  value = module.postgresql.private_ip_address
}

output "vpc_access_connector" {
  value = google_vpc_access_connector.vpc_access_conn.id
}
