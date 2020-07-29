#!/bin/sh

# CAREFULL, env.js is handled manually for now
rm build/env.js
# remove sourcemaps
rm build/static/js/*.js.map


aws s3 cp build/ s3://bsport-backoffice-asset-staging/ --recursive  --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
aws cloudfront create-invalidation --distribution-id E3HVVKK3QMOC4B --paths /index.html /service-worker.js /manifest.json
sentry-cli releases deploys "$VERSION" new -e staging
