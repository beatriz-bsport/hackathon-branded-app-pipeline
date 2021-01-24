#!/bin/sh

set -e

S3BUCKETLOCATION=/scripts

S3DESTINATION=$S3BUCKETNAME$S3BUCKETLOCATION

echo $ENVIRONMENT
cp ./config.$ENVIRONMENT.js ./config.production.js

echo "Current env is "
cat ./config.production.js
cat ./config.production.js | echo

yarn
yarn build
cd dist/

aws s3 sync ./ s3://$S3DESTINATION/ \
  --cache-control max-age=31536000,public \
  --acl public-read \
  --exclude widget.js  \
  --exclude "*.map*"

aws s3 cp ./widget.js s3://$S3DESTINATION/widget.js \
  --metadata-directive REPLACE \
  --cache-control max-age=0,no-cache,no-store,must-revalidate \
  --content-type application/javascript \
  --acl public-read

aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths /scripts/widget.js

cd -
