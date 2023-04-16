variable "project_id" {
  type = string
}

variable "credentials_file" {
  type = string
}

variable "docker_image_name" {
  type = string
}

variable "service_application_name" {
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


