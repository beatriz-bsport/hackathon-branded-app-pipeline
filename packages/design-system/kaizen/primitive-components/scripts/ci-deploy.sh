#!/bin/sh

# ===== Variables =====

# Env variables
ENV=$1

# Common variables
S3_BUCKET="s3://bsport-eu-docs"
S3_KAIZEN_PATH="storybook/kaizen"

if [ "$ENV" = "dev" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/$CI_COMMIT_REF_NAME"
    echo "✅ Upload new version of Storybook at $S3_FINAL_PATH"
elif [ "$ENV" = "staging" ]; then
    echo "⚠️ Storybook is only updated on dev !"
    exit 0
elif [ "$ENV" = "production" ]; then
    echo "⚠️ Storybook is only updated on dev !"
    exit 0
elif [ "$ENV" = "feature-branch" ]; then
    echo "⚠️ Storybook is only updated on dev !"
    exit 0
else 
    echo "⚠️ Environment $ENV is not recognized"
    exit 0
fi

# ===== Script =====
# Build storybook
NODE_OPTIONS=--max-old-space-size=8192 pnpm storybook:build --quiet --output-dir storybook
# Upload build
aws s3 cp ./storybook/ $S3_FINAL_PATH --recursive --only-show-errors --acl public-read