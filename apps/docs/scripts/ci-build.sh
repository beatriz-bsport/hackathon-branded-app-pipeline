#!/bin/sh

set -eu

ENVIRONMENT=${1:-}
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DOCS_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
S3_KAIZEN_DOCS_PATH="docs/kaizen"

echo "Start building Kaizen docs for Environment : $ENVIRONMENT"

if [ "$ENVIRONMENT" = "dev" ]; then
  S3_ENV_PATH="dev"
  STORYBOOK_ENV_PATH="dev"
elif [ "$ENVIRONMENT" = "staging" ]; then
  S3_ENV_PATH="staging"
  STORYBOOK_ENV_PATH="staging"
elif [ "$ENVIRONMENT" = "production" ]; then
  S3_ENV_PATH="production"
  STORYBOOK_ENV_PATH="production"
elif [ "$ENVIRONMENT" = "review" ]; then
  S3_ENV_PATH="review/${CI_COMMIT_REF_SLUG:-local}"
  STORYBOOK_ENV_PATH="dev"
else
  echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
  exit 0
fi

DOCS_BASE_PATH="/$S3_KAIZEN_DOCS_PATH/$S3_ENV_PATH/"
STORYBOOK_BASE_URL="https://docs.infra.bsport.io/storybook/kaizen/$STORYBOOK_ENV_PATH"

echo "🛠️ Building Kaizen docs with VITE_BASE=$DOCS_BASE_PATH and VITE_STORYBOOK_BASE_URL=$STORYBOOK_BASE_URL"
cd "$DOCS_ROOT"
VITE_BASE="$DOCS_BASE_PATH" VITE_STORYBOOK_BASE_URL="$STORYBOOK_BASE_URL" NODE_OPTIONS=--max-old-space-size=8192 pnpm build
