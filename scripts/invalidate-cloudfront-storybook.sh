#!/bin/sh

CLOUDFRONT_ID=$1
CLOUDFRONT_INVALIDATION_TOKEN=$2

# cloudfront invalidation must be executed inside the AWS account were the cloudfront distribution lives
# to achieve this, we call a lambda function living there, which has the right permissions.
#
curl --get \
   --data-urlencode paths='["/$CI_COMMIT_REF_NAME/index.html","/$CI_COMMIT_REF_NAME/locales"]' \
   --data-urlencode distribution_id=${CLOUDFRONT_ID} \
   --data-urlencode token=${CLOUDFRONT_INVALIDATION_TOKEN} \
   https://6pmc3n3l2yo5krr4v3jq6qud6i0fwkqj.lambda-url.eu-west-3.on.aws/
