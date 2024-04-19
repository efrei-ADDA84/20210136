variable "subscription_id" {
  default     = "765266c6-9a23-4638-af32-dd1e32613047"
  description = "Azure subscription ID."
}

variable "resource_group_location" {
  default     = "francecentral"
  description = "Location of the resource group."
}

variable "virtual_network_name" {
  default     = "network-tp4"
  description = "Name of the existing virtual network."
}

variable "resource_group_name" {
  default     = "ADDA84-CTP"
  description = "Name of the existing resource group."
}

variable "subnet_name" {
  default     = "internal"
  description = "Name of the existing subnet."
}

variable "network_interface_name" {
  default     = "nic-20210136"
  description = "Name of the network interface."
}

variable "public_ip_name" {
  default     = "publicip-20210136"
  description = "Name of the public IP."
}

variable "virtual_machine_name" {
  default     = "devops-20210136"
  description = "Name of the virtual machine."
}

