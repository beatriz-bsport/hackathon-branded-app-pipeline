#!/bin/sh

set -e

# ===== Variables =====

ENVIRONMENT=$1
BUILD_ENV_FILE="build/env.js"
VERSION=$(cat ./VERSION)
VERSION_SHA="$VERSION-$CI_COMMIT_SHORT_SHA"

# Define the env file to use to replace the build env file
if [ "$ENVIRONMENT" = "feature-branch" ]; then
    FRONTEND_ONLY=$2
    FEATURE_BRANCH_IDENTIFIER=$(echo $CI_COMMIT_TAG | sed -n 's/.*deploy-\(frontend-only-\)\{0,1\}\([[:alnum:]_-]\+\).*/\2/p')
    if [ "$FRONTEND_ONLY" = "true" ]; then
        ENV_TEMPLATE_FILE="envs/template-frontend-only-feature-branch"
    else
        ENV_TEMPLATE_FILE="envs/template-feature-branch"
    fi
else 
    ENV_TEMPLATE_FILE=envs/$ENVIRONMENT
fi

# ===== Script =====

echo "*"
echo "⏳ Start building @bsport/saas-legacy for environment: $ENVIRONMENT $FEATURE_BRANCH_IDENTIFIER"

# Update release files
echo "*"
echo "Update version files"
echo "\"$VERSION\"" > public/version.json
echo "export default '`date +%F+%H+%M`';" > src/release-date.js
echo "export default '$VERSION';" > src/release.js
echo "export default '$VERSION_SHA';" > src/release-sha.js

# Build the application
echo "*"
echo "Update translations"
pnpm run translation:update
echo "*"
echo "Build @bsport/sm-navigation-sidebar in compatibility mode"
pnpm --filter @bsport/sm-navigation-sidebar run build:compat
echo "*"
echo "Build @bsport/saas-legacy"
pnpm run build
echo "*"

# Replace the env file
echo "Populate $BUILD_ENV_FILE with $ENV_TEMPLATE_FILE"
cp $ENV_TEMPLATE_FILE $BUILD_ENV_FILE
# If a feature branch identifier is detected, then populate the template file
if [ "$FEATURE_BRANCH_IDENTIFIER" ]; then
    echo "Replace FEATURE_BRANCH_IDENTIFIER by $FEATURE_BRANCH_IDENTIFIER in $BUILD_ENV_FILE"
    sed -i "s/FEATURE_BRANCH_IDENTIFIER/$FEATURE_BRANCH_IDENTIFIER/g" $BUILD_ENV_FILE
fi

echo "✅ Successfully built @bsport/saas-legacy !"
echo "*"