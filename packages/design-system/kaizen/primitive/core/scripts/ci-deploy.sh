#!/bin/sh

# ===== Variables =====

# Env variables
ENV=$1
echo "Start uploading Kaizen Storybook for environment : $ENV"

# Common variables
S3_BUCKET="s3://bsport-eu-docs"
S3_KAIZEN_PATH="storybook/kaizen"
S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/$CI_COMMIT_REF_SLUG"

if [ "$ENV" = "dev" ]; then
    continue
elif [ "$ENV" = "staging" ]; then
    continue
elif [ "$ENV" = "production" ]; then
    continue
else 
    echo "⚠️  Environment $ENV is not recognized ! Stop script ..."
    exit 0
fi

# ===== Script =====

# Build storybook
NODE_OPTIONS=--max-old-space-size=8192 pnpm storybook:build --quiet --output-dir storybook

# Upload build on AWS S3 bucket
aws s3 cp ./storybook/ $S3_FINAL_PATH --recursive --only-show-errors --acl public-read

echo "✅ Upload successful at $S3_FINAL_PATH"