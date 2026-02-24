#!/bin/bash

set -euo pipefail

DEPLOY_ENVIRONMENT=$1
API_ENVIRONMENT=${2:-$1}
FRONTEND_ONLY_FLAG=${3:-""}

echo "=========================================="
echo "🚀 Starting Ephemeral Environment"
echo "=========================================="
echo "Deploy environment: $DEPLOY_ENVIRONMENT"
echo "API environment: $API_ENVIRONMENT"
echo "Frontend only: ${FRONTEND_ONLY_FLAG:-false}"
echo "=========================================="
echo ""

# Select all projects
SELECTED_PROJECTS=$(pnpm exec nx show projects --sep="," --exclude="@bsport/widget-legacy")

# Select all MFE
REVAMP_MFE=$(pnpm exec nx show projects --sep="," \
  --projects=tag:application:revamp --exclude="@bsport/template-*")

echo "These are the projects:"
echo "$SELECTED_PROJECTS" | sed "s/,/\n/g"
echo "These are the related Micro Frontends":
echo "$REVAMP_MFE" | sed "s/,/\n/g"
echo ""

echo "⏳ Building projects"

pnpm exec nx run-many --target=ci:build --projects=$SELECTED_PROJECTS "dev" true
pnpm exec nx ci:build:mfe @bsport/sm-host "$REVAMP_MFE"

echo "✅ All projects have been rebuilt"

echo "⏳ Aggregating projects into a single build output for deployment"
mkdir -p build/studio/apps
cp -r apps/applications/saas-legacy/build/* build/
cp -r apps/widgets/widget-proxy-bridge/dist build/widget-proxy-bridge
cp -r apps/applications/studio-manager/host/dist/* build/studio/

echo $REVAMP_MFE | sed "s/,/\n/g" | xargs -I {} bash -c 'MFE_PATH=$(pnpm exec nx show project {} --json | jq -r ".root") && cp -r ${MFE_PATH}/dist build/studio/apps/$(basename ${MFE_PATH})'

rm -rf build/studio/apps/host

echo "✅ Build output aggregated successfully"

echo "⏳ Pushing build output to S3 for deployment"

aws s3 sync build/ s3://bsport-backoffice-artifacts-euw3/mr/${CI_MERGE_REQUEST_IID} --only-show-errors --delete

echo "✅ Artifacts pushed to S3 successfully"

echo "⏳ Deploying to ephemeral environment"

aws s3 sync s3://bsport-backoffice-artifacts-euw3/mr/${CI_MERGE_REQUEST_IID} s3://bsport-backoffice-assets-ephemeral-environment/preview-${CI_MERGE_REQUEST_IID} --only-show-errors

echo "✅ Ephemeral environment deployed successfully"
