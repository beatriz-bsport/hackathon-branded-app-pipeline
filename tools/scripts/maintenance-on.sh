#!/bin/bash
# maintenance-on.sh — Enable maintenance mode for the bsport backoffice.
#
# Usage:
#   ./maintenance-on.sh <environment>
#
# Examples:
#   ./maintenance-on.sh ephemeral   (requires CI_MERGE_REQUEST_IID to be set)
#   ./maintenance-on.sh dev
#   ./maintenance-on.sh staging
#   ./maintenance-on.sh production
#
# Requires: aws CLI authenticated, CLOUDFRONT_INVALIDATION_TOKEN env var set
#           (not required for ephemeral — TTL=0, no invalidation needed).

set -eu

if [ -z "${1:-}" ]; then
  echo "ERROR: Usage: $0 <environment>"
  echo "   Environments: ephemeral | dev | staging | production"
  exit 1
fi

ENVIRONMENT=$1
REPO_ROOT="$(git rev-parse --show-toplevel)"

echo "==================================================="
echo "  Enabling maintenance mode -- $ENVIRONMENT"
echo "==================================================="

. "$REPO_ROOT/tools/scripts/set-deploy-config.sh" "$ENVIRONMENT"

MAINTENANCE_HTML="$REPO_ROOT/apps/applications/studio-manager/host/public/maintenance.html"

if [ ! -f "$MAINTENANCE_HTML" ]; then
  echo "ERROR: maintenance.html not found at: $MAINTENANCE_HTML"
  exit 1
fi

CACHE_CONTROL="no-cache, no-store, must-revalidate"

# ── 1. Back up current index files ─────────────────────────────────────────
echo ""
echo "1) Backing up current index.html files (best-effort)"
aws s3 cp "$S3_BUCKET/index.html"        "$S3_BUCKET/index.html.bak"        --only-show-errors || true
aws s3 cp "$S3_BUCKET/studio/index.html" "$S3_BUCKET/studio/index.html.bak" --only-show-errors || true

# ── 2. Upload maintenance page as both index.html files ────────────────────
echo ""
echo "2) Uploading maintenance page as index.html"
aws s3 cp "$MAINTENANCE_HTML" "$S3_BUCKET/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "$CACHE_CONTROL" \
  --only-show-errors \
  ${ACL_PARAM:-}

aws s3 cp "$MAINTENANCE_HTML" "$S3_BUCKET/studio/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "$CACHE_CONTROL" \
  --only-show-errors \
  ${ACL_PARAM:-}

# ── 3. Upload maintenance.json marker ──────────────────────────────────────
echo ""
echo "3) Uploading maintenance.json"
printf '{"enabled":true}' | aws s3 cp - "$S3_BUCKET/maintenance.json" \
  --content-type "application/json" \
  --cache-control "$CACHE_CONTROL" \
  ${ACL_PARAM:-}

# ── 4. Invalidate CloudFront (skipped for ephemeral — TTL=0) ───────────────
if [ -n "${CLOUDFRONT_ID:-}" ] && [ -n "${CLOUDFRONT_INVALIDATION_LAMBDA_URL:-}" ]; then
  echo ""
  echo "4) Invalidating CloudFront distribution ($CLOUDFRONT_ID)"
  curl --silent --fail --get \
    --data-urlencode 'paths=["/index.html","/studio/index.html","/maintenance.json"]' \
    --data-urlencode "distribution_id=${CLOUDFRONT_ID}" \
    --data-urlencode "token=${CLOUDFRONT_INVALIDATION_TOKEN}" \
    "${CLOUDFRONT_INVALIDATION_LAMBDA_URL}"
else
  echo ""
  echo "4) Skipping CloudFront invalidation (not configured for $ENVIRONMENT)"
fi

echo ""
echo "==================================================="
echo "  Maintenance mode ENABLED on $ENVIRONMENT"
echo "      Users already in-app will be redirected"
echo "      within ~30 s via the maintenance.json poll."
echo "==================================================="
