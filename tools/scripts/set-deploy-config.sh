#! /bin/sh

set -eE

ENVIRONMENT=$1

if [ "$ENVIRONMENT" = "feature-branch" ]; then
  REPO_ROOT="$(git rev-parse --show-toplevel)"
  . $REPO_ROOT/tools/scripts/parse-feature-branch-id.sh "$CI_COMMIT_TAG"
  SLACK_WEBHOOK_URL=$SLACK_READY_FOR_TEST_WEBHOOK_URL
  S3_BUCKET="s3://bsport-backoffice-assets-feature-branch-$FEATURE_BRANCH_IDENTIFIER"
  FRONTEND_URL="backoffice-$FEATURE_BRANCH_IDENTIFIER.chaos.bsport.io"
  CLOUDFRONT_ID=$(grep "^$FEATURE_BRANCH_IDENTIFIER " ci/feature-branch-listing.txt | cut -d' ' -f2)
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
  SENTRY_ENVIRONMENT=$FEATURE_BRANCH_IDENTIFIER

elif [ "$ENVIRONMENT" = "dev" ]; then
  SLACK_WEBHOOK_URL=$SLACK_DEV_WEBHOOK_URL
  SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template.json"
  S3_BUCKET="s3://bsport-backoffice-assets-dev"
  FRONTEND_URL="backoffice.dev.bsport.io"
  CLOUDFRONT_ID="E250Q872DC5CN7"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
  SENTRY_ENVIRONMENT=$ENVIRONMENT

elif [ "$ENVIRONMENT" = "staging" ]; then
  SLACK_WEBHOOK_URL=$SLACK_STAGING_WEBHOOK_URL
  SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template.json"
  # TODO : are we still on staging sandbox environment for this ???
  S3_BUCKET="s3://backoffice-staging-sandbox"
  FRONTEND_URL="backoffice.staging.bsport.io"
  CLOUDFRONT_ID="EPNH7BAGZLI8K"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://m4ptvmggmplbez5dwa7gkew4xa0bxjvd.lambda-url.eu-west-3.on.aws/"
  SENTRY_ENVIRONMENT=$ENVIRONMENT

elif [ "$ENVIRONMENT" = "production" ]; then
  SLACK_WEBHOOK_URL=$SLACK_PRODUCTION_WEBHOOK_URL
  SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template.json"
  S3_BUCKET="s3://bsport-eu-backoffice-production"
  FRONTEND_URL="backoffice.bsport.io"
  CLOUDFRONT_ID="E321VOI5045USU"
  CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://6pmc3n3l2yo5krr4v3jq6qud6i0fwkqj.lambda-url.eu-west-3.on.aws/"
  SENTRY_ENVIRONMENT=$ENVIRONMENT
  ACL_PARAM="--acl public-read"

else
  echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
  exit 0
fi

echo "Env config set for $ENVIRONMENT"
