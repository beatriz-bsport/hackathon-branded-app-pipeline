#!/bin/sh

set -e

echo "ENVIRONMENT: $ENVIRONMENT"

echo cloning saas repo
git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/bsport/@bsport/saas-legacy.git /@bsport/saas-legacy

cd /@bsport/saas-legacy

echo "CI_COMMIT_REF_NAME: $CI_COMMIT_REF_NAME"


SAAS_TO_CHECKOUT=$CI_COMMIT_REF_NAME

if [ $CI_COMMIT_REF_NAME != "dev" ] && [ $CI_COMMIT_REF_NAME != "master" ] && [ $CI_COMMIT_REF_NAME != "production" ]
then
	SAAS_TO_CHECKOUT="dev"
fi

echo checkout saas to $SAAS_TO_CHECKOUT
git checkout $SAAS_TO_CHECKOUT

rm -fr /@bsport/saas-legacy/.git/
mkdir -p ./build

# get the correct saas env file
cp /@bsport/saas-legacy/envs/$ENVIRONMENT ./build/env.js

pnpm run install --frozen-lockfile

echo linking project
pnpm run link

cd -

echo linking back saas in widget 
pnpm run link @bsport/saas-legacy
