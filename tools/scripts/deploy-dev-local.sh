#!/bin/bash

set -euo pipefail
s3sync "s3://bsport-frontends-artifacts-euw3/backoffice/dev/" "s3://bsport-backoffice-assets-dev-local/" --delete --check-etag
aws s3 cp apps/applications/saas-legacy/envs/local-dev.js "s3://bsport-backoffice-assets-dev-local/env.js" --only-show-errors
aws s3 cp apps/applications/studio-manager/host/envs/local.env.js "s3://bsport-backoffice-assets-dev-local/studio/env.js" --only-show-errors
aws s3 cp apps/applications/studio-manager/host/envs/local.studio-env.js "s3://bsport-backoffice-assets-dev-local/studio/studio-env.js" --only-show-errors

echo "✅ Artifact deployed successfully"
