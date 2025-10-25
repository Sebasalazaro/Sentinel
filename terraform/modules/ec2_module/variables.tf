variable "instances" {
    type = list(object({
        name          = string
        instance_type = string
    }))
}
