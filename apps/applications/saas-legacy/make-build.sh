#!/bin/sh

set -e

DATE=`date +%Y-%m-%d-%H-%M-%S`

VERSION=$DATE-`sentry-cli releases propose-version`
S3BUCKETNAME=bsport-backoffice

echo "export default '$VERSION';" > src/release.js

## git push

pnpm run sentry-cli releases new "$VERSION"
pnpm run
pnpm run updateTranslation
pnpm run build
pnpm run sentry-cli releases set-commits "$VERSION" --auto


pnpm run sentry-cli releases files $VERSION upload-sourcemaps --validate --url-prefix 'https://backoffice.bsport.io/static/js/' --ignore 'node_modules/' --rewrite build/static/js/
pnpm run sentry-cli releases finalize "$VERSION"
