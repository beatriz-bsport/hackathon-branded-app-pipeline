#!/bin/sh

# How to use ? Just provide your API identifier as first argument
# ====================
# pnpm start-fb theta
# ====================

set -e

# ===== Variables =====

ENVIRONMENT=$1
NODE_OPTIONS=--openssl-legacy-provider
NODE_ENV=development
BROWSER=none
ENV_FILE=public/env.js
DEPLOYED_URL="https:\/\/backoffice-$ENVIRONMENT.chaos.bsport.io"
LOCAL_URL="http:\/\/localhost:3000"
SENTRY_DSN_TO_REMOVE="https:\/\/e79eb0bbbeb69b951b5fa17508b14cc8\@o137411\.ingest\.us\.sentry\.io\/4508597404631040"

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: pnpm start-fb <feature-branch-id>" >&2
  exit 1
fi


# ===== Prepare =====

# Build translations files in public/locales
pnpm run translation:update

# Declare the env file to use
cp envs/template-feature-branch $ENV_FILE

# Replace the feature branch identifier, the frontend url and remove the sentry DSN
sed -i "s/FEATURE_BRANCH_IDENTIFIER/$ENVIRONMENT/g" $ENV_FILE
sed -i "s/$DEPLOYED_URL/$LOCAL_URL/g" $ENV_FILE
sed -i "s/$SENTRY_DSN_TO_REMOVE//g" $ENV_FILE

# ===== Script =====

pnpm exec concurrently --kill-others \
    "env=$ENVIRONMENT pnpm run start:sidebar" \
    "NODE_OPTIONS=$NODE_OPTIONS NODE_ENV=$NODE_ENV BROWSER=$BROWSER webpack serve --config config/webpack.dev.js"
