terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }

  required_version = ">= 1.2.0"

  backend "s3" {
    bucket         = "finances-app-state-bucket"
    key            = "frontend/terraform.tfstate"
    region         = "sa-east-1"
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = "sa-east-1"
}

data "aws_caller_identity" "current" {}