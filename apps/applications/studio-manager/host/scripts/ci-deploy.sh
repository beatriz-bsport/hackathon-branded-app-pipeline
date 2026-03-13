#!/bin/sh

set -eu

ENVIRONMENT=$1
DEFAULT_APPLICATIONS="@bsport/sm-host,@bsport/sm-navigation-sidebar"
RAW_APPLICATIONS=${2:-$DEFAULT_APPLICATIONS}
APPLICATIONS=$(printf "%b" "$RAW_APPLICATIONS" | tr '\n ' ',' | sed 's/,,*/,/g; s/^,//; s/,$//')

if [ -z "$APPLICATIONS" ]; then
  APPLICATIONS="$DEFAULT_APPLICATIONS"
fi

echo "*"
echo "⏳ Deploying Studio Manager applications"
echo "Setting deploy config for $ENVIRONMENT"

ROOT_DIR=$(git rev-parse --show-toplevel)
. "$ROOT_DIR/tools/scripts/set-deploy-config.sh" "$ENVIRONMENT"
S3_BUCKET="$S3_BUCKET/studio"

for APPLICATION in $(printf "%s" "$APPLICATIONS" | tr ',' '\n'); do
  case "$APPLICATION" in
    @bsport/sm-host)
      ASSET_PATH="apps/applications/studio-manager/host"
      S3_URL="$S3_BUCKET"
      ;;
    @bsport/sm-navigation-sidebar)
      ASSET_PATH="apps/applications/studio-manager/navigation-sidebar"
      S3_URL="$S3_BUCKET/apps/navigation-sidebar"
      ;;
    *)
      echo "⏭️ Skipping unsupported Studio Manager application: $APPLICATION"
      continue
      ;;
  esac

  DIST_DIR="$ROOT_DIR/$ASSET_PATH/dist"
  if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Error: dist directory does not exist in $ROOT_DIR/$ASSET_PATH"
    exit 1
  fi

  if [ "$APPLICATION" = "@bsport/sm-host" ]; then
    RELEASE_SHA=${CI_COMMIT_SHORT_SHA:-local}
    sed -i'' -e "s/__RELEASE_SHA_PLACEHOLDER__/$RELEASE_SHA/g" "$DIST_DIR/index.html"
  fi

  echo "📦 Uploading $APPLICATION dist to $S3_URL"
  aws s3 cp "$DIST_DIR/" "$S3_URL" --recursive --only-show-errors ${ACL_PARAM:-}
  echo "✅ Success"
  echo "*"
done

echo "⏳ Invalidate CloudFront distribution"
curl --get \
  --data-urlencode 'paths=["/studio/*"]' \
  --data-urlencode "distribution_id=${CLOUDFRONT_ID}" \
  --data-urlencode "token=${CLOUDFRONT_INVALIDATION_TOKEN}" \
  "${CLOUDFRONT_INVALIDATION_LAMBDA_URL}"

echo "✅ Successfully deployed: $ENVIRONMENT"
echo "*"
