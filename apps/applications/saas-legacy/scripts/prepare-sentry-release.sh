#!/bin/sh

set -e

VERSION=$1
BACKOFFICE_DOMAIN=$2

pnpm run sentry-cli releases new "$VERSION"
pnpm run sentry-cli releases set-commits "$VERSION" --auto
pnpm run sentry-cli releases files ${VERSION} upload-sourcemaps --validate --url-prefix "https://${BACKOFFICE_DOMAIN}/static/js/" --ignore 'node_modules/' --rewrite build/static/js/
pnpm run sentry-cli releases finalize "$VERSION"
