#!/bin/bash
# maintenance-off.sh — Disable maintenance mode for the bsport backoffice.
#
# Usage:
#   ./maintenance-off.sh <environment>
#
# Examples:
#   ./maintenance-off.sh ephemeral   (requires CI_MERGE_REQUEST_IID to be set)
#   ./maintenance-off.sh dev
#   ./maintenance-off.sh staging
#   ./maintenance-off.sh production
#
# Requires: aws CLI authenticated, CLOUDFRONT_INVALIDATION_TOKEN env var set
#           (not required for ephemeral — TTL=0, no invalidation needed).
# Note: restores from *.bak backups created by maintenance-on.sh.
#       If you prefer, run the normal deploy pipeline instead.

set -eu

if [ -z "${1:-}" ]; then
  echo "ERROR: Usage: $0 <environment>"
  echo "   Environments: ephemeral | dev | staging | production"
  exit 1
fi

ENVIRONMENT=$1
REPO_ROOT="$(git rev-parse --show-toplevel)"

echo "==================================================="
echo "  Disabling maintenance mode -- $ENVIRONMENT"
echo "==================================================="

. "$REPO_ROOT/tools/scripts/set-deploy-config.sh" "$ENVIRONMENT"

CACHE_CONTROL="no-cache, no-store, must-revalidate"

# ── 1. Check backups exist ──────────────────────────────────────────────────
echo ""
echo "1) Verifying backups exist in S3"
if ! aws s3 ls "$S3_BUCKET/index.html.bak" > /dev/null 2>&1; then
  echo "ERROR: No backup found at $S3_BUCKET/index.html.bak"
  echo "   Run the normal deploy pipeline to restore the application."
  exit 1
fi

# ── 2. Restore index files from backups ─────────────────────────────────────
echo ""
echo "2) Restoring index.html files from backups"
aws s3 cp "$S3_BUCKET/index.html.bak"        "$S3_BUCKET/index.html" \
  --cache-control "$CACHE_CONTROL" \
  --only-show-errors \
  ${ACL_PARAM:-}

if aws s3 ls "$S3_BUCKET/studio/index.html.bak" > /dev/null 2>&1; then
  aws s3 cp "$S3_BUCKET/studio/index.html.bak" "$S3_BUCKET/studio/index.html" \
    --cache-control "$CACHE_CONTROL" \
    --only-show-errors \
    ${ACL_PARAM:-}
else
  echo "   No studio backup found, skipping studio restore"
fi

# ── 3. Remove maintenance.json ───────────────────────────────────────────────
echo ""
echo "3) Removing maintenance.json"
aws s3 rm "$S3_BUCKET/maintenance.json" --only-show-errors || true

# ── 4. Delete backups ───────────────────────────────────────────────────────
echo ""
echo "4) Deleting backups"
aws s3 rm "$S3_BUCKET/index.html.bak" --only-show-errors || true
aws s3 rm "$S3_BUCKET/studio/index.html.bak" --only-show-errors || true

# ── 5. Invalidate CloudFront (skipped for ephemeral — TTL=0) ────────────────
if [ -n "${CLOUDFRONT_ID:-}" ] && [ -n "${CLOUDFRONT_INVALIDATION_LAMBDA_URL:-}" ]; then
  if [ -z "${CLOUDFRONT_INVALIDATION_TOKEN:-}" ]; then
    echo "ERROR: CLOUDFRONT_INVALIDATION_TOKEN is required when invalidation is configured"
    exit 1
  fi
  echo ""
  echo "5) Invalidating CloudFront distribution ($CLOUDFRONT_ID)"
  curl --silent --show-error --fail --get \
    --max-time 30 \
    --retry 3 \
    --retry-delay 2 \
    --data-urlencode 'paths=["/index.html","/studio/index.html"]' \
    --data-urlencode "distribution_id=${CLOUDFRONT_ID}" \
    --data-urlencode "token=${CLOUDFRONT_INVALIDATION_TOKEN}" \
    "${CLOUDFRONT_INVALIDATION_LAMBDA_URL}"
else
  echo ""
  echo "5) Skipping CloudFront invalidation (not configured for $ENVIRONMENT)"
fi

echo ""
echo "==================================================="
echo "  Maintenance mode DISABLED on $ENVIRONMENT"
echo "      The backoffice is live again."
echo "==================================================="
