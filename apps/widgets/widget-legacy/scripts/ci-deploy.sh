#!/bin/sh

set -eE

# ===== Variables =====

ENVIRONMENT=$1

# Define the env file to use to replace the build env file
if [ "$ENVIRONMENT" = "feature-branch" ]; then
  # Extract FEATURE_BRANCH_IDENTIFIER, FORCE and FRONTEND_ONLY from CI_COMMIT_TAG
  REPO_ROOT="$(git rev-parse --show-toplevel)"
  . $REPO_ROOT/tools/scripts/parse-feature-branch-id.sh "$CI_COMMIT_TAG"
  
  if [ "$FRONTEND_ONLY" = "true" ]; then
    echo "Deploy Widget on frontend-only feature-branch"
    ENV_TEMPLATE_FILE="./config.template-feature-branch.js"
  else
    echo "⚠️  Widget is only deployed on feature branch frontend only"
    exit 0
  fi
  
  S3_BUCKET="s3://bsport-widget-assets-feature-branch-$FEATURE_BRANCH_IDENTIFIER"
  CDN_DOMAIN="cdn-$FEATURE_BRANCH_IDENTIFIER.chaos.bsport.io"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
  CLOUDFRONT_ID=$(grep "^$FEATURE_BRANCH_IDENTIFIER " ci/feature-branch-listing.txt | cut -d' ' -f2)
  SLACK_WEBHOOK_URL=$SLACK_FEATURE_BRANCH_WEBHOOK_URL

elif [ "$ENVIRONMENT" = "dev" ]; then
  S3_BUCKET="s3://bsport-widget-assets-dev"
  CDN_DOMAIN="cdn.dev.bsport.io"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
  CLOUDFRONT_ID="E2YERBKPKQC7FE"
  SLACK_WEBHOOK_URL=$SLACK_DEV_WEBHOOK_URL
  ACL_PARAM="--acl public-read"

elif [ "$ENVIRONMENT" = "staging" ]; then
  S3_BUCKET="s3://cdn-staging-sandbox"
  CDN_DOMAIN="cdn.staging.bsport.io"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://m4ptvmggmplbez5dwa7gkew4xa0bxjvd.lambda-url.eu-west-3.on.aws/"
  CLOUDFRONT_ID="E1ZLJRXTF8O188"
  SLACK_WEBHOOK_URL=$SLACK_STAGING_WEBHOOK_URL
  ACL_PARAM="--acl public-read"

elif [ "$ENVIRONMENT" = "production" ]; then
  S3_BUCKET="s3://bsport-cdn"
  CDN_DOMAIN="cdn.bsport.io"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://6pmc3n3l2yo5krr4v3jq6qud6i0fwkqj.lambda-url.eu-west-3.on.aws/"
  CLOUDFRONT_ID="E3PVSAXDFQZX1T"
  SLACK_WEBHOOK_URL=$SLACK_PRODUCTION_WEBHOOK_URL
  ACL_PARAM="--acl public-read"

else
    echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
    exit 0
fi

WIDGET_LEGACY_PWD=$(pwd)

# ===== Functions =====

send_slack_notification() {
    cd $WIDGET_LEGACY_PWD 
    export ICON=$1
    EXIT_STATUS=$2
    if [ "$EXIT_STATUS" = "0" ]; then
        export STATUS="Success"
    else
        export STATUS="Failure"
    fi
    envsubst < ./slack_template.json > slack_template_interpolated.json
    cat slack_template_interpolated.json
    curl -s -d @slack_template_interpolated.json --header "Content-Type: application/json" $SLACK_WEBHOOK_URL || exit $EXIT_STATUS
}

# ===== Error handler =====

handle_error() {
    EXIT_CODE=$?
    if [ "$EXIT_CODE" = "0" ]; then
        echo "@bsport/widget-legacy ci-deploy exit with success"
    else
        echo "An error occurred : exit code is $EXIT_CODE !"
        ICON_URL="http://www.pngall.com/wp-content/uploads/2016/06/Fail-Stamp-PNG-Clipart.png"
        send_slack_notification $ICON_URL $EXIT_CODE
    fi
}

trap handle_error EXIT

# ===== Script =====

echo "*"
echo "⏳ Start deploying @bsport/widget-legacy to feature-branch $FEATURE_BRANCH_IDENTIFIER"

# Upload to s3 bucket
cd dist/

aws s3 sync ./ $S3_BUCKET/scripts \
  --cache-control max-age=31536000,public \
  --exclude widget.js  \
  --exclude "*.map*" \
  --no-progress $ACL_PARAM

aws s3 cp ./widget.js $S3_BUCKET/scripts/widget.js \
  --metadata-directive REPLACE \
  --cache-control max-age=0,no-cache,no-store,must-revalidate \
  --content-type application/javascript $ACL_PARAM

curl --get \
   --data-urlencode paths='["/scripts/widget.js"]' \
   --data-urlencode distribution_id=$CLOUDFRONT_ID \
   --data-urlencode token=$CLOUDFRONT_INVALIDATION_TOKEN \
   $CLOUDFRONT_INVALIDATION_LAMBDA_URL

cd -

# Send notification to Slack
ICON_URL="https://pluspng.com/img-png/success-png-success-icon-image-23194-400.png"
send_slack_notification $ICON_URL 0

echo "✅ Successfully deployed @bsport/widget-legacy"
echo "*"
