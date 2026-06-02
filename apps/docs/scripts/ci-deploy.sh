#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DOCS_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DIST_DIR="$DOCS_ROOT/dist"
S3_FINAL_PATH="s3://bsport-eu-docs/docs/kaizen/dev"

echo "Start uploading Kaizen docs to dev"

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Missing docs artifact at $DIST_DIR. Run pnpm -C apps/docs ci:build first."
  exit 1
fi

echo "⏳ Uploading Kaizen docs to $S3_FINAL_PATH"
aws s3 cp "$DIST_DIR/" "$S3_FINAL_PATH" --recursive --only-show-errors --acl public-read

echo "✅ Upload successful at $S3_FINAL_PATH"
