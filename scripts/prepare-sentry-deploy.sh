#!/bin/sh

set -e

OFFICIAL_VERSION=$1
ENVIRONMENT=$2
SHA=$3
INTERNAL_VERSION="${OFFICIAL_VERSION}-${SHA}"


yarn run sentry-cli releases deploys "${INTERNAL_VERSION}" new -e "${ENVIRONMENT}"
