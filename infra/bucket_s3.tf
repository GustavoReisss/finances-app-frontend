resource "aws_s3_bucket" "finances_app_bucket" {
  bucket = "finances-app-frontend-bucket"
}

# resource "aws_s3_bucket_acl" "bucket_acl" {
#   bucket = aws_s3_bucket.finances_app_bucket.id
#   acl    = "private"
# }

resource "aws_s3_bucket_policy" "cdn-oac-bucket-policy" {
  bucket = aws_s3_bucket.finances_app_bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions = [ "s3:GetObject" ]
    resources = [ "${aws_s3_bucket.finances_app_bucket.arn}/*" ]
    
    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = ["arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.cloudfront_distribution_id}"]
    }
  }
}