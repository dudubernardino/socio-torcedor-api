variable "project_id" {
  type = string
}
variable "docker_image_name" {
  type    = string
  default = "us-central1-docker.pkg.dev/socio-torcedor-api/socio-torcedor/socio-torcedor-backend:latest"
}

variable "container_port" {
  description = "The docker container port"
  type        = number
  default     = 3000
}

variable "service_application_name" {
  type    = string
  default = "socio-torcedor-api"
}

variable "connect_database" {
  type    = bool
  default = true
}

variable "connect_vpc" {
  type    = bool
  default = true
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

variable "cpu_limit" {
  description = "The limit of number of cpus provided to the container, allowed values are {1,2}"
  default     = "1000m"
}

variable "mem_limit" {
  description = "The limit of memory provided to the container, maximum is 2Gi"
  default     = "512Mi"
}

variable "container_concurrency" {
  description = "The max requests each container in the revision should serve concurrently, default and max is 80"
  default     = "25"
}

variable "timeout_seconds" {
  description = "The max duration the instance is allowed for responding to a request."
  default     = "300"
}

variable "cloud_run_annotations" {
  type        = map(string)
  description = "metadata annotations"
  default     = {}
}
