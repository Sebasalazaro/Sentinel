# Security Groups

resource "aws_security_group" "trivy_sg" {
    name        = "trivy-instance-sg"
    description = "Security group for trivy-instance"

    ingress {
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_security_group" "backend_sg" {
    name        = "backend-sg"
    description = "Security group for backend instance"

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 8080
        to_port     = 8080
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}


# Map instance name to security group
locals {
    sg_map = {
        "trivy-instance" = aws_security_group.trivy_sg.id
        "backend"        = aws_security_group.backend_sg.id
    }
}

resource "aws_instance" "instances" {
    for_each      = { for inst in var.instances : inst.name => inst }
    ami           = "ami-0bbdd8c17ed981ef9" # Ajustar según región y AMI deseada
    instance_type = each.value.instance_type
    security_groups = [
        local.sg_map[each.key]
    ]

    tags = {
        Name = each.key
    }
}
