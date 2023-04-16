variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

variable "deletion_protection" {
  default = true
}

variable "postgres_network_name" {
  description = "Transit VPC name"
  default     = "postgres-transit-vpc"
}

variable "postgres_network_cidr_range" {
  description = "IP range"
  default     = "10.8.0.0/28"
}

variable "postgres_vpcconn_name" {
  description = "The name of the VPC access connector"
  default     = "postgresvpcaccess"
}

variable "postgres_vpcconn_cidr_range" {
  description = "VPC access connector CIDR range"
  default     = "10.7.0.0/28"
}
