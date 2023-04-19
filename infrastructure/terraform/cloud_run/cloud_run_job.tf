# # Creating and executing Cloud Run Jobs are still not in terrafom :(
# # https://github.com/hashicorp/terraform-provider-google/issues/11743
module "gcloud" {
  source  = "terraform-google-modules/gcloud/google"
  version = "3.1.1"

  platform              = "linux"
  additional_components = ["beta"]

  create_cmd_body = "beta run jobs create ${var.project_id}-migration --project=${var.project_id}--set-secrets=POSTGRES_PASSWORD=POSTGRES_PASSWORD:latest --set-env-vars=POSTGRES_DB=${var.project_id}-db,POSTGRES_USER=superiniciador,POSTGRES_HOST=${data.google_storage_bucket_object_content.postgres_internal_ip.content},POSTGRES_PORT=5432 --vpc-connector=${data.google_storage_bucket_object_content.vpc_access_connector.content} --image=us-central1-docker.pkg.dev/socio-torcedor-api/socio-torcedor/migration:latest --region=${var.region} --service-account=serviceAccount:${var.email} --memory=1024Mi"
  # destroy_cmd_body = "beta run jobs delete ${each.key}-migration --project=${each.key} --region=${var.region} --quiet && sleep 60"
}
