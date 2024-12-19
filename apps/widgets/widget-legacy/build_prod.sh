#!/bin/sh

set -e

S3BUCKETLOCATION=/scripts

S3DESTINATION=$S3BUCKETNAME$S3BUCKETLOCATION

echo "ENVIRONMENT: $ENVIRONMENT"

echo "FEATURE_BRANCH_IDENTIFIER: $FEATURE_BRANCH_IDENTIFIER"

if [[ "$ENVIRONMENT" != "production" ]]
then
  if [ -z $FEATURE_BRANCH_IDENTIFIER ]
  then
    cp ./config.$ENVIRONMENT.js ./config.production.js
  else
    # For feature branches, template-feature-branch is used,
    # within which the FEATURE_BRANCH_IDENTIFIER string is replaced by the actual current feature branch identifier.
    CONFIG_TEMPLATE_FILE=template-feature-branch
    sed -i "s/FEATURE_BRANCH_IDENTIFIER/${FEATURE_BRANCH_IDENTIFIER}/g" ./config.${CONFIG_TEMPLATE_FILE}.js
    cp ./config.${CONFIG_TEMPLATE_FILE}.js ./config.production.js
  fi
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
