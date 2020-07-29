#!/bin/sh

set -e

DATE=`date +%Y-%m-%d-%H-%M-%S`

VERSION=$DATE-`sentry-cli releases propose-version`
S3BUCKETNAME=bsport-backoffice

echo "export default '$VERSION';" > src/release.js

## git push

yarn run sentry-cli releases new "$VERSION"
yarn
yarn updateTranslation
yarn build
yarn run sentry-cli releases set-commits "$VERSION" --auto


yarn run sentry-cli releases files $VERSION upload-sourcemaps --validate --url-prefix 'https://backoffice.bsport.io/static/js/' --ignore 'node_modules/' --rewrite build/static/js/
yarn run sentry-cli releases finalize "$VERSION"
