#!/bin/sh

set -e

FEATURE_BRANCH_IDENTIFIER=$1

echo cloning saas repo
git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/bsport/bsport-saas.git /bsport-saas

cd /bsport-saas
if [ $CI_COMMIT_REF_NAME != "dev" ] && [ $CI_COMMIT_REF_NAME != "master" ] && [ $CI_COMMIT_REF_NAME != "production" ]
then
	if [ -z $CI_COMMIT_TAG ] # if there is no tag here, let's take dev
	then
	  CI_COMMIT_REF_NAME="dev"
	fi
fi
echo checkout saas to $CI_COMMIT_REF_NAME
git checkout $CI_COMMIT_REF_NAME
rm -fr /bsport-saas/.git/
mkdir -p ./build

echo "FEATURE_BRANCH_IDENTIFIER: $FEATURE_BRANCH_IDENTIFIER"

if [ -z $FEATURE_BRANCH_IDENTIFIER ]
then
	cp /bsport-saas/envs/$ENVIRONMENT ./build/env.js
else
	ENV_TEMPLATE_FILE=template-frontend-only-feature-branch
	sed -i "s/FEATURE_BRANCH_IDENTIFIER/${FEATURE_BRANCH_IDENTIFIER}/g" /bsport-saas/envs/${ENV_TEMPLATE_FILE}
	cp /bsport-saas/envs/${ENV_TEMPLATE_FILE} ./build/env.js
fi
yarn install --frozen-lockfile

echo linking project
yarn link

cd -

echo linking back saas in widget 
yarn link bsport-saas
