cd app

# Build app
ng build

# Clear bucket
aws s3 rm s3://finances-app-frontend-bucket --recursive

# Upload files to bucket s3
aws s3 sync dist/ s3://finances-app-frontend-bucket

# Invalidate Cache (Apply changes immediately)
aws cloudfront create-invalidation --distribution-id E2G3GT03EZKXR5 --paths "/*"

cd ..