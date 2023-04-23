module "bastion_instance_sql_access" {
  source  = "../compute"
  project = var.project_id
  zone    = var.zone
  region  = var.region
  network = module.vpc_module.network_self_link
  subnet  = module.vpc_module.subnets_self_links[0]
}
