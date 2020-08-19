#!/bin/sh

set -e

OFFICIAL_VERSION=$1
BACKOFFICE_DOMAIN=$2
SHA=$3
INTERNAL_VERSION="${OFFICIAL_VERSION}-${SHA}"

yarn run sentry-cli releases new "$INTERNAL_VERSION"
yarn run sentry-cli releases set-commits "$INTERNAL_VERSION" --auto
yarn run sentry-cli releases files ${INTERNAL_VERSION}- upload-sourcemaps --validate --url-prefix "https://${BACKOFFICE_DOMAIN}/static/js/" --ignore 'node_modules/' --rewrite build/static/js/
yarn run sentry-cli releases finalize "$INTERNAL_VERSION"
