#!/bin/sh

set -eE

# List of applications to deploy
# Check if second argument is provided (SM_AFFECTED_PROJECTS)
if [ -n "$2" ]; then
  # Use the provided list of affected projects
  echo "Using provided list of affected projects"
  # Convert literal \n to actual newlines
  APPLICATIONS=$(printf "%b" "$2")
else
  # Fall back to the fixed list of applications from apps.txt
  echo "Using fixed list of applications from apps.txt"
  APPLICATIONS=$(cat ./scripts/apps.txt)
fi

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
  S3_BUCKET="s3://backoffice-staging-sandbox"
  FRONTEND_URL="backoffice.staging.bsport.io"
  CLOUDFRONT_ID="EPNH7BAGZLI8K"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://m4ptvmggmplbez5dwa7gkew4xa0bxjvd.lambda-url.eu-west-3.on.aws/"
elif [ "$ENVIRONMENT" = "production" ]; then
  S3_BUCKET="s3://bsport-eu-backoffice-production"
  FRONTEND_URL="backoffice.bsport.io"
  CLOUDFRONT_ID="E321VOI5045USU"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://6pmc3n3l2yo5krr4v3jq6qud6i0fwkqj.lambda-url.eu-west-3.on.aws/"
  ACL_PARAM="--acl public-read"
else
  echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
  exit 0
fi

S3_BUCKET="$S3_BUCKET/studio"

# Capture script directory before changing directory
SCRIPT_DIR="$(pwd)/scripts"

ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"
echo "LOGS : THIS IS ROOT_DIR : $ROOT_DIR"

for APPLICATION in $APPLICATIONS; do
  echo "*"
  echo "⏳ Copying $APPLICATION assets to S3"
  PWD_BEGIN=$(pwd)
  echo "📦 Starting directory: $PWD_BEGIN"

  # get the path relative to the application root, for example for @bsport/sm-host it will
  # be "apps/applications/b2b/host"
  ASSET_PATH=$(node "$SCRIPT_DIR/get-app-path.mjs" "$APPLICATION")
  if [ $? -ne 0 ] || [ -z "$ASSET_PATH" ]; then
    echo "Error: Failed to get project root for $APPLICATION (using devkit)"
    exit 0
  fi

  # Debug output to see exact ASSET_PATH value
  echo "DEBUG: ASSET_PATH='$ASSET_PATH'"

  # Skip deployment if the asset path doesn't include 'apps/applications'
  # Use grep to check if the path contains 'apps/applications'
  if ! echo "$ASSET_PATH" | grep -q "apps/applications"; then
    echo "⏭️ Skipping deployment for $APPLICATION: Path '$ASSET_PATH' is not in apps/applications"
    continue
  else
    echo "✅ Path '$ASSET_PATH' contains 'apps/applications', proceeding with deployment"
  fi

  echo "Project root found: $ASSET_PATH"

  cd "$ROOT_DIR/$ASSET_PATH"

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
  --data-urlencode paths='["/studio/*"]' \
  --data-urlencode distribution_id=${CLOUDFRONT_ID} \
  --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
  ${CLOUDFRONT_INVALIDATION_LAMBDA_URL}

echo "✅ Successfully deployed: $ENVIRONMENT"
echo "*"
