#!/bin/bash

set -euo pipefail

DEPLOY_ENVIRONMENT=$1
API_ENVIRONMENT=${2:-$1}
FRONTEND_ONLY_FLAG=${3:-""}
STUDIO_MFE="@bsport/sm-host,@bsport/sm-navigation-sidebar"

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

echo "These are the projects:"
echo "$SELECTED_PROJECTS" | sed "s/,/\n/g"
echo "These are the Studio Manager Micro Frontends":
echo "$STUDIO_MFE" | sed "s/,/\n/g"
echo ""

echo "⏳ Building projects"

pnpm exec nx run-many --target=ci:build --projects=$SELECTED_PROJECTS "dev" true
pnpm exec nx ci:build:mfe @bsport/sm-host "$STUDIO_MFE"

echo "✅ All projects have been rebuilt"

echo "⏳ Aggregating projects into a single build output for deployment"
mkdir -p build/studio/apps
cp -r apps/applications/saas-legacy/build/* build/
cp -r apps/widgets/widget-proxy-bridge/dist build/widget-proxy-bridge
cp -r apps/applications/studio-manager/host/dist/* build/studio/

cp -r apps/applications/studio-manager/navigation-sidebar/dist build/studio/apps/navigation-sidebar

rm -rf build/studio/apps/host

echo "✅ Build output aggregated successfully"

echo "⏳ Pushing build output to S3 for deployment"

aws s3 sync build/ s3://bsport-frontends-artifacts-euw3/backoffice/mr-${CI_MERGE_REQUEST_IID} --only-show-errors --delete

echo "✅ Artifacts pushed to S3 successfully"

echo "⏳ Deploying to ephemeral environment"

aws s3 sync s3://bsport-frontends-artifacts-euw3/backoffice/mr-${CI_MERGE_REQUEST_IID} s3://bsport-backoffice-assets-ephemeral-environment/preview-${CI_MERGE_REQUEST_IID} --only-show-errors

aws s3 cp apps/applications/studio-manager/host/envs/dev.studio-env.js s3://bsport-backoffice-assets-ephemeral-environment/preview-${CI_MERGE_REQUEST_IID}/studio/studio-env.js --only-show-errors

echo "✅ Ephemeral environment deployed successfully"
