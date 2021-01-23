#!/bin/sh

set -e


echo cloning saas repo
git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/bsport/bsport-saas.git /bsport-saas

cd /bsport-saas

echo checkout saas to $CI_COMMIT_REF_NAME
git checkout $CI_COMMIT_REF_NAME
yarn install --frozen-lockfile

echo linking project
yarn link

cd -

echo linking back saas in widget 
yarn link bsport-saas
