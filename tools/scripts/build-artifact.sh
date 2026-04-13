#!/bin/bash

set -euo pipefail

STUDIO_MFE="@bsport/sm-host,@bsport/sm-navigation-sidebar"

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

aws s3 sync build/ s3://bsport-frontends-artifacts-euw3/backoffice/${CI_COMMIT_SHORT_SHA} --only-show-errors --delete

echo "✅ Artifacts pushed to S3 successfully"
