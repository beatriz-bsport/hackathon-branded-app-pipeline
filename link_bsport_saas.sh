#!/bin/sh

set -e

FEATURE_BRANCH_IDENTIFIER=$1
echo "FEATURE_BRANCH_IDENTIFIER: $FEATURE_BRANCH_IDENTIFIER"

echo cloning saas repo
git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/bsport/bsport-saas.git /bsport-saas

cd /bsport-saas

SAAS_TO_CHECKOUT=$CI_COMMIT_REF_NAME

if [ $CI_COMMIT_REF_NAME != "dev" ] && [ $CI_COMMIT_REF_NAME != "master" ] && [ $CI_COMMIT_REF_NAME != "production" ]
then
	SAAS_TO_CHECKOUT="dev"
fi

if [ -z $FEATURE_BRANCH_IDENTIFIER ] # if there is tag here, let's take dev
then
	echo not feature branch
else
	echo feature branch ?
	SAAS_TO_CHECKOUT=deploy-frontend-only-$FEATURE_BRANCH_IDENTIFIER
fi

echo checkout saas to $SAAS_TO_CHECKOUT
git checkout $SAAS_TO_CHECKOUT

rm -fr /bsport-saas/.git/
mkdir -p ./build


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
