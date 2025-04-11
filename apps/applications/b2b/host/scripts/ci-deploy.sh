#!/bin/sh

set -eE

# List of applications to deploy
APPLICATIONS="@bsport/sm-host @bsport/sm-navigation-sidebar @bsport/sm-group-activity"

echo "*"
echo "⏳ Deploying Studio Manager applications"

ENVIRONMENT=$1

if [ "$ENVIRONMENT" = "feature-branch" ]; then
  FEATURE_BRANCH_IDENTIFIER=$(echo $CI_COMMIT_TAG | sed -n 's/.*deploy-\(frontend-only-\)\{0,1\}\([[:alnum:]_-]\+\).*/\2/p')
  S3_BUCKET="s3://bsport-backoffice-assets-feature-branch-$FEATURE_BRANCH_IDENTIFIER"
  FRONTEND_URL="backoffice-$FEATURE_BRANCH_IDENTIFIER.chaos.bsport.io"
  CLOUDFRONT_ID=$(grep "^$FEATURE_BRANCH_IDENTIFIER " ci/feature-branch-listing.txt | cut -d' ' -f2)
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"

  ENVIRONMENT=$FEATURE_BRANCH_IDENTIFIER
elif [ "$ENVIRONMENT" = "dev" ]; then
  S3_BUCKET="s3://bsport-backoffice-assets-dev"
  FRONTEND_URL="backoffice.dev.bsport.io"
  CLOUDFRONT_ID="E250Q872DC5CN7"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
elif [ "$ENVIRONMENT" = "staging" ]; then
  echo "⚠️  Not enabled yet (soon™)"
  exit 0
elif [ "$ENVIRONMENT" = "production" ]; then
  echo "⚠️  Not enabled yet (soon™)"
  exit 0
else
  echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
  exit 0
fi

S3_BUCKET="$S3_BUCKET/v2"

ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"
echo "LOGS : THIS IS ROOT_DIR : $ROOT_DIR"

for APPLICATION in $APPLICATIONS; do
  echo "*"
  echo "⏳ Copying $APPLICATION assets to S3"
  PWD_BEGIN=$(pwd)
  echo "LOGS : THIS IS PWD_BEGIN : $PWD_BEGIN"

  # get the path relative to the application root, for example for @bsport/sm-host it will
  # be "apps/applications/b2b/host"
  ASSET_PATH=$(pnpm exec nx show project $APPLICATION | grep '"root":' | sed 's/.*"root": *"\([^"]*\).*/\1/')
  echo "LOGS : THIS IS ASSET_PATH : $ASSET_PATH"
  
  cd "$ROOT_DIR/$ASSET_PATH"
  PWD=$(pwd)
  echo "LOGS : THIS IS pwd : $PWD"
  

  # set S3_URL
  if [ "$APPLICATION" = "@bsport/sm-host" ]; then
    # for host we use the bucket root
    S3_URL="$S3_BUCKET"
  else
    # Use current folder name as app name
    APP_NAME=$(basename $(pwd))
    echo "LOGS : THIS IS APP_NAME : $APP_NAME"
    S3_URL="$S3_BUCKET/apps/$APP_NAME"
  fi

  echo "📦 Current directory: $(pwd)"
  echo "📦 Checking dist directory:"
  ls -la ./dist || echo "dist directory not found!"

  if [ ! -d "./dist" ]; then
    echo "❌ Error: dist directory does not exist in $(pwd)"
    exit 1
  fi

  echo "📦 Uploading dist to $S3_URL"
  # actl not needed for now, only for production
  aws s3 cp ./dist/ $S3_URL --recursive --only-show-errors $ACL_PARAM

  cd "$ROOT_DIR"

  echo "✅ Success"
  echo "*"
done

echo "*"
echo "⏳ Invalidate CloudFront distribution"
# cloudfront invalidation must be executed inside the AWS account where the cloudfront distribution lives
# to achieve this, we call a lambda function living there, which has the right permissions.

# CLOUDFRONT_INVALIDATION_TOKEN is a Gitlab CI/CD variable
curl --get \
  --data-urlencode paths='["/v2/*"]' \
  --data-urlencode distribution_id=${CLOUDFRONT_ID} \
  --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
  ${CLOUDFRONT_INVALIDATION_LAMBDA_URL}

echo "✅ Successfully deployed: $ENVIRONMENT"
echo "*"
