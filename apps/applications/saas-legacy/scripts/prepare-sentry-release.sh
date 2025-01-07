#!/bin/sh

set -e

VERSION=$1
BACKOFFICE_DOMAIN=$2

# Use Gitlab CI/CD variables to provide following args : --org $SENTRY_ORG --project $SENTRY_PROJECT
sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto
sentry-cli releases files "$VERSION" upload-sourcemaps --validate --url-prefix "https://$BACKOFFICE_DOMAIN/static/js/" --ignore 'node_modules/' --rewrite build/static/js/
sentry-cli releases finalize "$VERSION"
