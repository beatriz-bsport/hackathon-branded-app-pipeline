#!/bin/sh

S3BUCKETNAME=bsport-cdn
S3BUCKETLOCATION=/scripts

S3DESTINATION=$S3BUCKETNAME$S3BUCKETLOCATION

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

aws cloudfront create-invalidation --distribution-id E3PVSAXDFQZX1T --paths /scripts/widget.js

cd -
