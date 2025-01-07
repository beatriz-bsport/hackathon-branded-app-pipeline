#!/bin/sh

set -e

VERSION=$1
ENVIRONMENT=$2

# Use Gitlab CI/CD variables to provide following args : --org $SENTRY_ORG --project $SENTRY_PROJECT
sentry-cli releases deploys "$VERSION" new -e "$ENVIRONMENT"
