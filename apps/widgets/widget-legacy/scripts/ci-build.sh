#!/bin/sh

set -e

# ===== Script =====

echo "*"
echo "⏳ Start building @bsport/widget-legacy"

# Build widget — env-agnostic; env.js is deployed separately
pnpm run build --stats 'errors-warnings'

echo "✅ Successfully built @bsport/widget-legacy !"
echo "*"
