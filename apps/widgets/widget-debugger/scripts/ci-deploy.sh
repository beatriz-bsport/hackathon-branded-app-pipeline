#!/bin/sh

set -eE

echo "*"
echo "⏳ Deploying widget-debugger"

ENVIRONMENT=$1

echo "Setting deploy config for $ENVIRONMENT"
REPO_ROOT="$(git rev-parse --show-toplevel)"
. $REPO_ROOT/tools/scripts/set-deploy-config.sh "$ENVIRONMENT"

S3_URL="$S3_BUCKET/widget-debugger"

echo "⏳ Copying $APPLICATION assets to S3"
aws s3 cp ./src/html/ $S3_URL --recursive --only-show-errors $ACL_PARAM

echo "*"
echo "⏳ Invalidate CloudFront distribution"
curl --get \
  --data-urlencode paths='["/widget-debugger/*"]' \
  --data-urlencode distribution_id=${CLOUDFRONT_ID} \
  --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
  ${CLOUDFRONT_INVALIDATION_LAMBDA_URL}

echo "*"
echo "✅ Successfully deployed: $ENVIRONMENT"
echo "*"
