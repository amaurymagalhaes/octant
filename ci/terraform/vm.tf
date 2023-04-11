module "context_vm" {
  source  = "cloudposse/label/null"
  version = "0.25.0"

  context    = module.context.context
  name       = "vm"
  attributes = [var.dns_endpoint]
}

resource "google_compute_instance" "vm" {
  machine_type = local.vm_config.machine_type
  name         = module.context_vm.id
  zone         = local.vm_config.zone
  labels = {
    "managed_by" : "terraform"
  }

  boot_disk {
    auto_delete = true

    initialize_params {
      image = "cos-cloud/cos-stable"
      labels = {
        "managed_by" : "terraform"
      }
      size = 10
    }
  }

  network_interface {
    network = local.vm_config.network
    # This default config gives ephemeral public IP for VM
    access_config {
    }

  }
  tags = [
    "http-server",
    "https-server",
    "traefik-api",
  ]

  metadata = {
    user-data : templatefile("${path.module}/templates/cloud-init.yaml", {
      dns_domain         = "${var.dns_endpoint}.${local.dns_root_domain}"
      docker_username    = var.gitlab_username,
      docker_password    = var.gitlab_token
      docker_services    = local.docker_services
      etherscan_api_key  = var.etherscan_api_key
      generate_contracts = var.generate_contracts
      image_versions     = local.image_versions
      images_prefix      = local.images_prefix
      network            = var.network
      tag                = var.octant_tag
      traefik_services   = local.traefik_services
      wallet_private_key = var.wallet_private_key
      contracts_b64      = filebase64("${path.module}/templates/contracts.txt")
    })
  }
}
