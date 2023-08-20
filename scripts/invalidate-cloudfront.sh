#!/bin/sh

CLOUDFRONT_ID=$1
CLOUDFRONT_INVALIDATION_TOKEN=$2

# cloudfront invalidation must be executed inside the AWS account were the cloudfront distribution lives
# to achieve this, we call a lambda function living there, which has the right permissions.
#
curl --get \
   --data-urlencode paths='["/index.html","/env.js","/service-worker.js","/manifest.json","/locales/*","/locales/*/*.json"]' \
   --data-urlencode distribution_id=${CLOUDFRONT_ID} \
   --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
   https://6pmc3n3l2yo5krr4v3jq6qud6i0fwkqj.lambda-url.eu-west-3.on.aws/
