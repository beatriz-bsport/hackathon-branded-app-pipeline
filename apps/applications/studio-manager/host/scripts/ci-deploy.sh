#!/bin/sh

set -eE

# Clean provided list (2nd arg) by converting literal \n to comma separator
APPLICATIONS=$(echo $(printf "%b" "$2") | sed "s/ /,/g")

# Always include sm-host to ensure release SHA can be injected during deployment of MFE
# Example: when sm-navigation-sidebar only is affected 
if ! echo "$APPLICATIONS" | grep -q "@bsport/sm-host"; then
  echo "Adding @bsport/sm-host to build list for release SHA injection"
  APPLICATIONS="@bsport/sm-host
$APPLICATIONS"
fi

echo "*"
echo "⏳ Deploying Studio Manager applications"

ENVIRONMENT=$1

echo "Setting deploy config for $ENVIRONMENT"
REPO_ROOT="$(git rev-parse --show-toplevel)"
. $REPO_ROOT/tools/scripts/set-deploy-config.sh "$ENVIRONMENT"


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

  # For sm-host only, inject the release SHA into index.html
  if [ "$APPLICATION" = "@bsport/sm-host" ]; then
    echo "📦 Injecting release SHA ($CI_COMMIT_SHORT_SHA) into index.html"
    sed -i'' -e "s/__RELEASE_SHA_PLACEHOLDER__/$CI_COMMIT_SHORT_SHA/g" ./dist/index.html
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
  --data-urlencode 'paths=["/studio/*"]' \
  --data-urlencode "distribution_id=${CLOUDFRONT_ID}" \
  --data-urlencode "token=${CLOUDFRONT_INVALIDATION_TOKEN}" \
  ${CLOUDFRONT_INVALIDATION_LAMBDA_URL}

echo "*"
echo "✅ Successfully deployed: $ENVIRONMENT"
echo "*"
