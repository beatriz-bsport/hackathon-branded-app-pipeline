#!/bin/sh

export SENTRY_AUTH_TOKEN="5518b2448f5441ad90cda6ec773eecbcbe514275195c4bd1a4c502de5c86e8ad"
export SENTRY_ORG=bsport-cg
export SENTRY_PROJECT=saas

VERSION=$(pnpm run --silent sentry-cli releases propose-version)

# Build
# REACT_APP_VERSION=$VERSION pnpm run build

# Create a release
pnpm run sentry-cli releases new -p $SENTRY_PROJECT $VERSION

# Associate commits with the release
pnpm run sentry-cli releases set-commits --auto $VERSION
pnpm run sentry-cli releases files $VERSION upload-sourcemaps --no-rewrite build/static/js/
