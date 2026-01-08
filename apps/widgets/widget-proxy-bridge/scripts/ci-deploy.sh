#!/bin/sh

set -eE

echo "*"
echo "⏳ Deploying widget-proxy-bridge"

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

S3_URL="$S3_BUCKET/widget-proxy-bridge"

echo "⏳ Copying $APPLICATION assets to S3"
aws s3 cp ./dist/ $S3_URL --recursive --only-show-errors $ACL_PARAM

echo "*"
echo "⏳ Invalidate CloudFront distribution"
curl --get \
  --data-urlencode paths='["/widget-proxy-bridge/*"]' \
  --data-urlencode distribution_id=${CLOUDFRONT_ID} \
  --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
  ${CLOUDFRONT_INVALIDATION_LAMBDA_URL}

echo "*"
echo "✅ Successfully deployed: $ENVIRONMENT"
echo "*"
