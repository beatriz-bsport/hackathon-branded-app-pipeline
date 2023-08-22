#!/bin/sh

set -e

S3BUCKETLOCATION=/scripts

S3DESTINATION=$S3BUCKETNAME$S3BUCKETLOCATION

echo $ENVIRONMENT
if [[ "$ENVIRONMENT" != "production" ]]
then
  cp ./config.$ENVIRONMENT.js ./config.production.js
fi

echo "Current env is "
cat ./config.production.js
cat ./config.production.js | echo

cd /bsport-saas
yarn link
cd -
yarn link bsport-saas

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

curl --get \
   --data-urlencode paths='["/scripts/widget.js"]' \
   --data-urlencode distribution_id=${CLOUDFRONT_ID} \
   --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
   https://6pmc3n3l2yo5krr4v3jq6qud6i0fwkqj.lambda-url.eu-west-3.on.aws/

cd -
