#!/bin/sh

set -e

echo "*"

TODAY="$(date +%F)"
RELEASE_NAME="release-${TODAY}-${CI_COMMIT_SHORT_SHA:-local}"

echo "*"
echo "⏳ Building widget-proxy-bridge ($RELEASE_NAME)"

VITE_RELEASE_NAME=$RELEASE_NAME pnpm build

echo "✅ Success"
echo "*"
