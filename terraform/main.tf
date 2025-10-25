terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 6.0"
        }
    }
}

provider "aws" {
    region = "us-east-1"
    shared_credentials_files = ["${path.root}/.aws/credentials"]
}


module "ec2" {
    source = "./modules/ec2_module"
    instances = [
        {name = "trivy-instance", instance_type = "t3.large"},
        {name = "backend", instance_type = "t2.large"}
    ]
}

module "sqs" {
    source = "./modules/sqs"
}

module "s3" {
    source = "./modules/s3_module"
    bucket_name = "results-sec-tests"
}
