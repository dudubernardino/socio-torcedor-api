variable "project_id" {
  type = string
}

variable "docker_image_name" {
  type = string
}

variable "container_port" {
  type = string
}

variable "service_application_name" {
  type = string
}

variable "postgres_host" {
  type = string
}

variable "vpc_access_connector" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
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
