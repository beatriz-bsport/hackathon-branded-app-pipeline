#!/bin/sh

set -e

# ===== Variables =====

ENVIRONMENT=$1
BUILD_ENV_FILE="build/env.js"
VERSION=$(cat ./VERSION)
VERSION_SHA="$VERSION-$CI_COMMIT_SHORT_SHA"

ENV_TEMPLATE_FILE=envs/$ENVIRONMENT

# ===== Script =====

echo "*"
echo "⏳ Start building @bsport/saas-legacy for environment: $ENVIRONMENT"

# Update release files
echo "*"
echo "Update version files"
echo "\"$VERSION_SHA\"" > public/version.json
echo "export default '`date +%F+%H+%M`';" > src/release-date.js
echo "export default '$VERSION_SHA';" > src/release.js
echo "export default '$VERSION_SHA';" > src/release-sha.js

# Build the application
echo "*"
echo "Update translations"
pnpm run translation:update
echo "*"
echo "Build @bsport/sm-navigation-sidebar in compatibility mode"
pnpm exec nx build:compat @bsport/sm-navigation-sidebar
echo "*"
echo "Build @bsport/saas-legacy"
pnpm run build
echo "*"

# Replace the env file
echo "Populate $BUILD_ENV_FILE with $ENV_TEMPLATE_FILE"
cp $ENV_TEMPLATE_FILE $BUILD_ENV_FILE

echo "✅ Successfully built @bsport/saas-legacy !"
echo "*"