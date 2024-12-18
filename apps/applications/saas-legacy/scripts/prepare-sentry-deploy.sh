#!/bin/sh

set -e

VERSION=$1
ENVIRONMENT=$2


pnpm run sentry-cli releases deploys "${VERSION}" new -e "${ENVIRONMENT}"
