#!/bin/sh

# ===== Variables =====

# Env variables
ENVIRONMENT=$1
echo "Start uploading Kaizen Unified Storybook for Environment : $ENVIRONMENT"

# Common variables
S3_BUCKET="s3://bsport-eu-docs"
S3_KAIZEN_PATH="storybook/kaizen"

if [ "$ENVIRONMENT" = "dev" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/dev"
elif [ "$ENVIRONMENT" = "staging" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/staging"
elif [ "$ENVIRONMENT" = "production" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/production"
elif [ "$ENVIRONMENT" = "feature-branch" ]; then
    FEATURE_BRANCH_IDENTIFIER=$(echo $CI_COMMIT_TAG | sed -n 's/.*deploy-\(frontend-only-\)\{0,1\}\([[:alnum:]_-]\+\).*/\2/p')
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/$FEATURE_BRANCH_IDENTIFIER"
else
    echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
    exit 0
fi

# ===== Script =====

# ===== Build storybook with env vars =====
echo "🛠️ Building Storybook with STORYBOOK_ENV=$ENVIRONMENT and SHA=$CI_COMMIT_SHORT_SHA"
STORYBOOK_ENV=$ENVIRONMENT STORYBOOK_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA NODE_OPTIONS=--max-old-space-size=8192 pnpm storybook:build --quiet --output-dir storybook

# Upload build on AWS S3 bucket
aws s3 cp ./storybook/ $S3_FINAL_PATH --recursive --only-show-errors --acl public-read

echo "✅ Upload successful at $S3_FINAL_PATH"

