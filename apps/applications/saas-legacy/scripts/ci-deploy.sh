#!/bin/sh

set -eE

# ===== Variables =====

ENVIRONMENT=$1

if [ "$ENVIRONMENT" = "feature-branch" ]; then
    # Extract FEATURE_BRANCH_IDENTIFIER, FORCE and FRONTEND_ONLY from CI_COMMIT_TAG
    REPO_ROOT="$(git rev-parse --show-toplevel)"
    . $REPO_ROOT/tools/scripts/parse-feature-branch-id.sh "$CI_COMMIT_TAG"
    SLACK_WEBHOOK_URL=$SLACK_READY_FOR_TEST_WEBHOOK_URL # Gitlab CI/CD variable
    if [ "$FRONTEND_ONLY" = "true" ]; then
        echo "Define variables for frontend-only feature-branch"
        SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template_feature-branch-ready-to-test.json"
    else
        echo "Define variables for frontend & backend feature-branch"
        SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template_feature-branch.json"
    fi
    S3_BUCKET="s3://bsport-backoffice-assets-feature-branch-$FEATURE_BRANCH_IDENTIFIER"
    FRONTEND_URL="backoffice-$FEATURE_BRANCH_IDENTIFIER.chaos.bsport.io"
    CLOUDFRONT_ID=$(grep "^$FEATURE_BRANCH_IDENTIFIER " ci/feature-branch-listing.txt | cut -d' ' -f2)
    CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
    SENTRY_ENVIRONMENT=$FEATURE_BRANCH_IDENTIFIER

elif [ "$ENVIRONMENT" = "dev" ]; then
    SLACK_WEBHOOK_URL=$SLACK_DEV_WEBHOOK_URL # Gitlab CI/CD variable
    SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template.json"
    S3_BUCKET="s3://bsport-backoffice-assets-dev"
    FRONTEND_URL="backoffice.dev.bsport.io"
    CLOUDFRONT_ID="E250Q872DC5CN7"
    CLOUDFRONT_INVALIDATION_LAMBDA_URL="https://uc7e26gvpwrprl5hubmfe4zeou0zyqyu.lambda-url.eu-west-3.on.aws/"
    SENTRY_ENVIRONMENT=$ENVIRONMENT

elif [ "$ENVIRONMENT" = "staging" ]; then
    SLACK_WEBHOOK_URL=$SLACK_STAGING_WEBHOOK_URL # Gitlab CI/CD variable
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

VERSION=$(cat ./VERSION)
VERSION_SHA="$VERSION-$CI_COMMIT_SHORT_SHA"

# ===== Functions =====

send_slack_notification() {
    export ICON=$1
    EXIT_STATUS=$2
    if [ "$EXIT_STATUS" = "0" ]; then
        export STATUS="Success"
    else
        export STATUS="Failure"
    fi
    export FEATURE_BRANCH_IDENTIFIER=$FEATURE_BRANCH_IDENTIFIER
    envsubst < $SLACK_TEMPLATE_FILE > slack_template_interpolated.json
    cat slack_template_interpolated.json
    curl -s -d @slack_template_interpolated.json --header "Content-Type: application/json" $SLACK_WEBHOOK_URL || exit $EXIT_STATUS
}

# ===== Error handler =====

handle_error() {
    EXIT_CODE=$?
    if [ "$EXIT_CODE" = "0" ]; then
        echo "@bsport/saas-legacy ci-deploy exit with success"
    else
        echo "An error occurred : exit code is $EXIT_CODE !"
        ICON_URL="http://www.pngall.com/wp-content/uploads/2016/06/Fail-Stamp-PNG-Clipart.png"
        send_slack_notification $ICON_URL $EXIT_CODE
    fi
}

trap handle_error EXIT

# ===== Script =====

echo "*"
echo "⏳ Start deploying @bsport/saas-legacy for environment: $ENVIRONMENT $FEATURE_BRANCH_IDENTIFIER"

# Prepare sentry release
echo "*"
echo "1) Prepare sentry release"
export SENTRY_NO_PROGRESS_BAR=1
./scripts/prepare-sentry-release.sh $VERSION_SHA $FRONTEND_URL

# # Last preparation
echo "*"
echo "2) Remove maps after having uploaded them to sentry, to prevent leaks"
rm ./build/static/js/*.js.map

# Upload to S3 Bucket the build output
echo "*"
echo "3) Upload build to S3 $S3_BUCKET"
aws s3 cp ./build/ $S3_BUCKET --recursive --only-show-errors $ACL_PARAM

# Update Cloudfront distribution
# CLOUDFRONT_INVALIDATION_TOKEN is a Gitlab CI/CD variable
echo "*"
echo "4) Invalidate cloudfront distribution"
./scripts/invalidate-cloudfront.sh $CLOUDFRONT_ID $CLOUDFRONT_INVALIDATION_TOKEN $CLOUDFRONT_INVALIDATION_LAMBDA_URL

# Deploy sentry release
echo "*"
echo "5) Prepare sentry deploy"
./scripts/prepare-sentry-deploy.sh $VERSION_SHA $SENTRY_ENVIRONMENT

# Send notification to Slack
ICON_URL="https://pluspng.com/img-png/success-png-success-icon-image-23194-400.png"
send_slack_notification $ICON_URL 0

echo "✅ Successfully deployed @bsport/saas-legacy $SENTRY_ENVIRONMENT"
echo "*"