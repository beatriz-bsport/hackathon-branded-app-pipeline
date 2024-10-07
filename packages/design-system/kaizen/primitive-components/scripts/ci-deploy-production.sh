#!/bin/sh

S3_BUCKET="s3://bsport-eu-docs"
NODE_OPTIONS=--max-old-space-size=8192 pnpm storybook:build --quiet --output-dir storybook
aws s3 cp ./storybook/ "$S3_BUCKET"/storybook/kaizen/"$CI_COMMIT_REF_NAME" --recursive --only-show-errors --acl public-read
