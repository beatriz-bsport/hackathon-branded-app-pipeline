#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DOCS_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DIST_DIR="$DOCS_ROOT/dist"
S3_BUCKET_NAME="bsport-eu-docs"
S3_PREFIX="docs/kaizen/dev"
S3_FINAL_PATH="s3://$S3_BUCKET_NAME/$S3_PREFIX"

echo "Start uploading Kaizen docs to dev"

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Missing docs artifact at $DIST_DIR. Run pnpm -C apps/docs ci:build first."
  exit 1
fi

echo "⏳ Uploading Kaizen docs to $S3_FINAL_PATH"
aws s3 cp "$DIST_DIR/" "$S3_FINAL_PATH" --recursive --only-show-errors --acl public-read
node "$DOCS_ROOT/scripts/upload-static-routes.mjs" "$DIST_DIR" "$S3_BUCKET_NAME" "$S3_PREFIX"

echo "✅ Upload successful at $S3_FINAL_PATH"
