#!/bin/sh

# export SENTRY_AUTH_TOKEN=...
# export SENTRY_ORG=my-org
# export SENTRY_PROJECT=saas

VERSION=$(yarn run --silent sentry-cli releases propose-version)

# Build
REACT_APP_VERSION=$VERSION yarn build

# Create a release
yarn run sentry-cli releases new -p $SENTRY_PROJECT $VERSION

# Associate commits with the release
yarn run sentry-cli releases set-commits --auto $VERSION
yarn run sentry-cli releases files $VERSION upload-sourcemaps --no-rewrite build/static/js/
