#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DOCS_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DOCS_BASE_PATH="/docs/kaizen/dev/"
STORYBOOK_BASE_URL="https://docs.infra.bsport.io/storybook/kaizen/dev"

echo "🛠️ Building Kaizen docs with VITE_BASE=$DOCS_BASE_PATH and VITE_STORYBOOK_BASE_URL=$STORYBOOK_BASE_URL"
cd "$DOCS_ROOT"
VITE_BASE="$DOCS_BASE_PATH" VITE_STORYBOOK_BASE_URL="$STORYBOOK_BASE_URL" NODE_OPTIONS=--max-old-space-size=8192 pnpm build
