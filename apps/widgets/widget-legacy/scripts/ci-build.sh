#!/bin/sh

set -e

# ===== Variables =====

ENVIRONMENT=$1

# Define the env file to use to replace the build env file
if [ "$ENVIRONMENT" = "feature-branch" ]; then
    FRONTEND_ONLY=$2
    if [ "$FRONTEND_ONLY" = "true" ]; then
        echo "Build Widget on frontend-only feature-branch"
        CONFIG_TEMPLATE_FILE="./config.template-feature-branch.js"
    else
        echo "⚠️  Widget is only built on feature branch frontend only"
        exit 0
    fi
    FEATURE_BRANCH_IDENTIFIER=$(echo $CI_COMMIT_TAG | sed -n 's/.*deploy-\(frontend-only-\)\{0,1\}\([[:alnum:]_-]\+\).*/\2/p')
    CDN_DOMAIN="cdn-$FEATURE_BRANCH_IDENTIFIER.chaos.bsport.io"

elif [ "$ENVIRONMENT" = "dev" ]; then
    CONFIG_TEMPLATE_FILE="./config.dev.js"
    CDN_DOMAIN="cdn.dev.bsport.io"

elif [ "$ENVIRONMENT" = "staging" ]; then
    CONFIG_TEMPLATE_FILE="./config.staging.js"
    CDN_DOMAIN="cdn.staging.bsport.io"

elif [ "$ENVIRONMENT" = "production" ]; then
    CONFIG_TEMPLATE_FILE="./config.production.js"
    CDN_DOMAIN="cdn.bsport.io"

else
    echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..."
    exit 0
fi

CONFIG_FINAL_FILE="./config.final.js"
CONFIG_PRODUCTION_FILE="./config.production.js" # File used by the build command
CONFIG_PRODUCTION_CACHE_FILE="./config.production-cache.js"

# ===== Script =====

echo "*"
echo "⏳ Start building @bsport/widget-legacy for environment: $ENVIRONMENT $FEATURE_BRANCH_IDENTIFIER"

# Create final config base based on the template
cp $CONFIG_TEMPLATE_FILE $CONFIG_FINAL_FILE
sed -i "s/FEATURE_BRANCH_IDENTIFIER/${FEATURE_BRANCH_IDENTIFIER}/g" $CONFIG_FINAL_FILE

# Replace production file content with the final file content, after caching it
cp $CONFIG_PRODUCTION_FILE $CONFIG_PRODUCTION_CACHE_FILE
cp $CONFIG_FINAL_FILE $CONFIG_PRODUCTION_FILE
echo "Current env is :"
cat $CONFIG_PRODUCTION_FILE

# Build widget
export CDN_DOMAIN=$CDN_DOMAIN
pnpm run build --stats 'errors-warnings'

# Restore initial config.production.js
cp $CONFIG_PRODUCTION_CACHE_FILE $CONFIG_PRODUCTION_FILE
rm $CONFIG_PRODUCTION_CACHE_FILE $CONFIG_FINAL_FILE

echo "✅ Successfully built @bsport/widget-legacy !"
echo "*"