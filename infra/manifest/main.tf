terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Provider principal (us-east-1)
provider "aws" {
  region = "us-east-1"
}

# Provider secundário para replicação (us-west-2)
provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

# Bucket principal de dados
resource "aws_s3_bucket" "nexus_apollo_data" {
  bucket = "nexus-apollo-data"

  tags = {
    Environment = "prod"
    Owner       = "nexus-team"
    Project     = "apollo"
  }
}

# ACL do bucket principal (private)
resource "aws_s3_bucket_acl" "nexus_apollo_data_acl" {
  bucket = aws_s3_bucket.nexus_apollo_data.id
  acl    = "private"
}

# Versionamento do bucket principal
resource "aws_s3_bucket_versioning" "nexus_apollo_data_versioning" {
  bucket = aws_s3_bucket.nexus_apollo_data.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Criptografia do bucket principal
resource "aws_s3_bucket_server_side_encryption_configuration" "nexus_apollo_data_encryption" {
  bucket = aws_s3_bucket.nexus_apollo_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = "alias/aws/s3"
    }
  }
}

# Bloqueio de acesso público
resource "aws_s3_bucket_public_access_block" "nexus_apollo_data_public_access" {
  bucket = aws_s3_bucket.nexus_apollo_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle (transição para Glacier após 30 dias)
resource "aws_s3_bucket_lifecycle_configuration" "nexus_apollo_data_lifecycle" {
  bucket = aws_s3_bucket.nexus_apollo_data.id

  rule {
    id     = "glacier-transition"
    status = "Enabled"

    filter {
      prefix = ""
    }

    transition {
      days          = 30
      storage_class = "GLACIER"
    }
  }
}

# Logging de acesso
resource "aws_s3_bucket_logging" "nexus_apollo_data_logging" {
  bucket = aws_s3_bucket.nexus_apollo_data.id

  target_bucket = aws_s3_bucket.logs_bucket.id
  target_prefix = "log/"
}

# Notificações (SNS tópico)
resource "aws_s3_bucket_notification" "nexus_apollo_data_notification" {
  bucket = aws_s3_bucket.nexus_apollo_data.id

  topic {
    topic_arn = aws_sns_topic.notifications.arn
    events    = ["s3:ObjectCreated:*"]
  }
}

# Replicação cruzada de região
resource "aws_s3_bucket_replication_configuration" "nexus_apollo_data_replication" {
  bucket = aws_s3_bucket.nexus_apollo_data.id
  role   = aws_iam_role.replication_role.arn

  rule {
    id       = "replicate-to-west"
    status   = "Enabled"
    priority = 1

    destination {
      bucket        = aws_s3_bucket.replication_bucket.arn
      storage_class = "STANDARD_IA"
    }
  }
}

# Bucket para logs de acesso
resource "aws_s3_bucket" "logs_bucket" {
  bucket = "nexus-apollo-data-logs"

  tags = {
    Environment = "prod"
    Owner       = "nexus-team"
    Purpose     = "logging"
  }
}

# ACL do bucket de logs (private)
resource "aws_s3_bucket_acl" "logs_bucket_acl" {
  bucket = aws_s3_bucket.logs_bucket.id
  acl    = "private"
}

# Versionamento do bucket de logs
resource "aws_s3_bucket_versioning" "logs_bucket_versioning" {
  bucket = aws_s3_bucket.logs_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bucket de destino para replicação (us-west-2)
resource "aws_s3_bucket" "replication_bucket" {
  provider = aws.west
  bucket   = "nexus-apollo-data-replica"

  tags = {
    Environment = "prod"
    Owner       = "nexus-team"
    Purpose     = "replication-destination"
  }
}

# ACL do bucket de replicação (private)
resource "aws_s3_bucket_acl" "replication_bucket_acl" {
  provider = aws.west
  bucket   = aws_s3_bucket.replication_bucket.id
  acl      = "private"
}

# Versionamento do bucket de replicação
resource "aws_s3_bucket_versioning" "replication_bucket_versioning" {
  provider = aws.west
  bucket   = aws_s3_bucket.replication_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Função IAM para replicação
resource "aws_iam_role" "replication_role" {
  name = "s3-replication-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "s3.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "replication_permissions" {
  role       = aws_iam_role.replication_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# Tópico SNS para notificações
resource "aws_sns_topic" "notifications" {
  name = "nexus-apollo-notifications"
}