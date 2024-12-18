#!/bin/sh

# export SENTRY_AUTH_TOKEN=...
# export SENTRY_ORG=...
# ./make-deploy.sh VERSION ENVIRONMENT

yarn run sentry-cli releases deploys $1 new -e $2
