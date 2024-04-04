resource "aws_cloudfront_origin_access_control" "cloudfront_s3_oac" {
  name                              = "CloudFront S3 OAC"
  description                       = "CloudFront S3 OAC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.finances_app_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_s3_oac.id
    origin_id                = aws_s3_bucket.finances_app_bucket.bucket
    origin_path              = "/finances-app/browser"
  }

  origin {
    domain_name              = "mxrnknfylcww3y2ogrz4kkoywe0iifob.lambda-url.sa-east-1.on.aws"
    origin_id                = "lambda_auth"

    custom_origin_config {
      https_port = 443
      http_port = 80
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.finances_app_bucket.bucket

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  ordered_cache_behavior {
    path_pattern = "/api/auth/*"
    
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods = ["HEAD", "GET", "OPTIONS"]
    target_origin_id = "lambda_auth"

    forwarded_values {
      query_string = true

      cookies {
        forward = "whitelist"
        whitelisted_names = [
          "sessionId"
        ]
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  custom_error_response {
    error_code = 403
    response_code = 200
    response_page_path = "/index.html"
  }
  

  price_class = "PriceClass_100" # PriceClass_100 (Mais barata, entrega rápida apenas para NA e EUROPA)

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  # SSL config
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Environment = "production"
  }
}