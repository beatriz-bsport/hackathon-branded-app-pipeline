#!/bin/sh

set -eE

# ===== Variables =====

ENVIRONMENT=$1

if [ "$ENVIRONMENT" = "feature-branch" && "$FRONTEND_ONLY" = "true" ]; then
    echo "Define variables for frontend-only feature-branch"
    SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template_feature-branch-ready-to-test.json"
else
    echo "Define variables for frontend & backend feature-branch"
    SLACK_TEMPLATE_FILE="./ci/slack_template/slack_template_feature-branch.json"
fi

echo "Setting deploy config for $ENVIRONMENT"
REPO_ROOT="$(git rev-parse --show-toplevel)"
. $REPO_ROOT/tools/scripts/set-deploy-config.sh "$ENVIRONMENT"

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