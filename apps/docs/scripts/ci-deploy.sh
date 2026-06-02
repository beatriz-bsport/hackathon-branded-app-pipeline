#!/bin/sh

set -eu

ENVIRONMENT=${1:-}
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DOCS_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DIST_DIR="$DOCS_ROOT/dist"
S3_BUCKET="s3://bsport-eu-docs"
S3_KAIZEN_DOCS_PATH="docs/kaizen"

echo "Start uploading Kaizen docs for Environment : $ENVIRONMENT"

if [ "$ENVIRONMENT" = "dev" ]; then
  S3_ENV_PATH="dev"
elif [ "$ENVIRONMENT" = "staging" ]; then
  S3_ENV_PATH="staging"
elif [ "$ENVIRONMENT" = "production" ]; then
  S3_ENV_PATH="production"
elif [ "$ENVIRONMENT" = "review" ]; then
  S3_ENV_PATH="review/${CI_COMMIT_REF_SLUG:-local}"
else
  echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
  exit 0
fi

S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_DOCS_PATH/$S3_ENV_PATH"

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Missing docs artifact at $DIST_DIR. Run pnpm -C apps/docs ci:build $ENVIRONMENT first."
  exit 1
fi

echo "⏳ Uploading Kaizen docs to $S3_FINAL_PATH"
aws s3 cp "$DIST_DIR/" "$S3_FINAL_PATH" --recursive --only-show-errors --acl public-read

echo "✅ Upload successful at $S3_FINAL_PATH"
