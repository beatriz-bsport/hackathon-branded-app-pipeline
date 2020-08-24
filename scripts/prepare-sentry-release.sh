#!/bin/sh

set -e

VERSION=$1
BACKOFFICE_DOMAIN=$2

yarn run sentry-cli releases new "$VERSION"
yarn run sentry-cli releases set-commits "$VERSION" --auto
yarn run sentry-cli releases files ${VERSION} upload-sourcemaps --validate --url-prefix "~/static/js/" --ignore 'node_modules/' --rewrite build/static/js/
yarn run sentry-cli releases finalize "$VERSION"
