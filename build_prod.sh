#!/bin/sh

yarn
yarn build
cd dist/
aws s3 cp ./ s3://bsport-cdn/scripts/ --recursive
aws cloudfront create-invalidation --distribution-id E3PVSAXDFQZX1T --paths /scripts/widget.js
cd -
