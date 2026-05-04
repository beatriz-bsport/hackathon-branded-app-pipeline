#!/bin/sh

set -e

S3BUCKETLOCATION=/scripts

S3DESTINATION=$S3BUCKETNAME$S3BUCKETLOCATION

echo "ENVIRONMENT: $ENVIRONMENT"

if [[ "$ENVIRONMENT" != "production" ]]
then
  cp ./config.$ENVIRONMENT.js ./config.production.js
fi

echo "Current env is "
cat ./config.production.js
cat ./config.production.js | echo

cd /@bsport/saas-legacy
pnpm run link
cd -
pnpm run link @bsport/saas-legacy

pnpm run
pnpm run build
cd dist/

aws s3 sync ./ s3://$S3DESTINATION/ \
  --cache-control max-age=31536000,public \
  --exclude widget.js  \
  --exclude "*.map*" $ACL_PARAM

aws s3 cp ./widget.js s3://$S3DESTINATION/widget.js \
  --metadata-directive REPLACE \
  --cache-control max-age=0,no-cache,no-store,must-revalidate \
  --content-type application/javascript $ACL_PARAM

curl --get \
   --data-urlencode paths='["/scripts/widget.js"]' \
   --data-urlencode distribution_id=${CLOUDFRONT_ID} \
   --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
   ${INVALIDATION_LAMBDA_URL}

cd -
