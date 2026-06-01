#!/bin/sh
set -eu

# ===== Variables =====

# Env variables
ENVIRONMENT=${1:-}
if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <dev|staging|production>" >&2
    exit 1
fi
echo "Start uploading Kaizen Unified Storybook for Environment : $ENVIRONMENT"

# Common variables
S3_BUCKET="s3://bsport-eu-docs"
S3_KAIZEN_PATH="storybook/kaizen"

if [ "$ENVIRONMENT" = "dev" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/dev"
elif [ "$ENVIRONMENT" = "staging" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/staging"
elif [ "$ENVIRONMENT" = "production" ]; then
    S3_FINAL_PATH="$S3_BUCKET/$S3_KAIZEN_PATH/production"
else
    echo "⚠️  Environment $ENVIRONMENT is not recognized ! Stop script ..." >&2
    exit 1
fi

# ===== Script =====

# ===== Build storybook with env vars =====
echo "🛠️ Building Storybook with STORYBOOK_ENV=$ENVIRONMENT and SHA=${CI_COMMIT_SHORT_SHA:-}"
STORYBOOK_ENV=$ENVIRONMENT STORYBOOK_COMMIT_SHORT_SHA=${CI_COMMIT_SHORT_SHA:-} NODE_OPTIONS=--max-old-space-size=8192 pnpm storybook:build --quiet --output-dir storybook-static

# Upload build on AWS S3 bucket.
#
# Storybook emits content-hashed assets under assets/ (e.g. iframe-<hash>.js)
# referenced by STABLE-named files: the entry files (index.html, iframe.html,
# index.json, project.json) AND the manager runtime (sb-manager/, sb-addons/,
# fonts, favicons). A plain `aws s3 cp --recursive` never deletes old hashed
# bundles and sets no Cache-Control, so CloudFront/browsers can serve a stale
# entry file pointing at a pre-existing old bundle while index.json is fresh —
# producing Storybook's "eme[e] is not a function" importFn error for the newest
# stories. We therefore upload by cache policy in a safe order, then invalidate.
#
# Cache policy hinges on the assets/ boundary: only assets/ is content-hashed, so
# only it is safe to mark `immutable`. EVERYTHING else is stable-named — pinning
# it `immutable` would re-introduce version skew (e.g. a stale manager shell for
# up to a year after a Storybook upgrade), so it must revalidate.
#
# ORDER MATTERS: upload new bundles → swap stable files → prune old bundles LAST.
# Pruning before the stable-file swap would delete bundles the still-live old
# entry files reference, 404-ing Storybook for anyone hitting a cache miss in
# the gap between steps.

# 1. Content-hashed assets (assets/ only) → immutable long cache. NO --delete
#    here: the old bundles must survive until the stable files (step 2) reference
#    the new ones.
echo "⬆️  Uploading hashed assets (immutable cache)"
aws s3 cp ./storybook-static/ "$S3_FINAL_PATH" \
    --recursive --exclude "*" --include "assets/*" \
    --cache-control "public, max-age=31536000, immutable" \
    --only-show-errors --acl public-read

# 2. Everything else (stable-named) → must revalidate, so a fresh index.json can
#    never pair with a stale iframe.html and a Storybook upgrade can't pin a stale
#    manager shell. `no-cache` lets clients keep bytes but revalidate every load
#    (cheap 304s for unchanged fonts/runtime). After this, the new stable files
#    reference the new bundles uploaded in step 1 (both present → consistent).
echo "⬆️  Uploading entry files + stable runtime (revalidate)"
aws s3 cp ./storybook-static/ "$S3_FINAL_PATH" \
    --recursive --exclude "assets/*" \
    --cache-control "public, no-cache, must-revalidate" \
    --only-show-errors --acl public-read

# 3. Prune orphaned old bundles LAST. Now nothing references them (stable files
#    are fresh), so deleting them is safe — no 404 window on any S3 cache miss.
#    --size-only so identical re-uploaded content isn't rewritten (which would
#    clobber the cache headers set above); this pass only deletes orphans.
echo "🧹 Pruning orphaned old bundles"
aws s3 sync ./storybook-static/ "$S3_FINAL_PATH" \
    --delete --size-only \
    --only-show-errors --acl public-read

# 4. Invalidate the CloudFront edge cache for this env's tree. This is the layer
#    that clears the *currently* stale entry files (cached under the old TTL before
#    the no-cache headers in step 2 take effect on the next fill). dev/staging/
#    production are path prefixes on the SAME docs.infra.bsport.io distribution
#    (bucket bsport-eu-docs), so the distribution id and lambda are fixed; only the
#    invalidation path varies. This step is MANDATORY and fails the job loudly —
#    a silently-skipped invalidation is what let the stale-cache bug reach users.
#    Wiring (from bsport-terraform):
#      - DOCS_CLOUDFRONT_ID: the docs.infra.bsport.io distribution
#        (projects/bsport-management/docs.tf → module "docs-cdn-frontend"). Its id
#        is a generated value: `terraform -chdir=projects/bsport-management output`
#        or `aws cloudfront list-distributions --query \
#        "DistributionList.Items[?contains(Aliases.Items,'docs.infra.bsport.io')].Id"`.
#      - CLOUDFRONT_INVALIDATION_LAMBDA_URL: the bsport-management cross-account
#        invalidator (projects/bsport-management/ci.tf output
#        "lambda_ci_cross_account_url"). It has cloudfront:CreateInvalidation on "*",
#        so it can invalidate the docs distribution. NOTE: use the *management*
#        account lambda url, not the dev/staging/prod urls in set-deploy-config.sh.
#      - CLOUDFRONT_INVALIDATION_TOKEN: existing masked CI var (token hardcoded in
#        lambda_ci_cross_account.py).
#    The lambda always returns HTTP 200 (it sets no statusCode), so curl --fail
#    only catches infra-level errors (bad URL, 5xx). We therefore FAIL CLOSED on
#    the body: success is the literal {"status": "sucess", ...} the lambda returns
#    (yes, "sucess" is misspelled in lambda_ci_cross_account.py — the `succ?ess`
#    pattern also accepts "success" should that typo ever be fixed). Anything else
#    — error, empty, malformed, or contract drift — fails the job.
: "${DOCS_CLOUDFRONT_ID:?must be set as a CI variable (docs.infra.bsport.io distribution id)}"
: "${CLOUDFRONT_INVALIDATION_LAMBDA_URL:?must be set as a CI variable (bsport-management lambda_ci_cross_account_url)}"
: "${CLOUDFRONT_INVALIDATION_TOKEN:?must be set as a CI variable}"
echo "🧹 Invalidating CloudFront ($DOCS_CLOUDFRONT_ID) for /$S3_KAIZEN_PATH/$ENVIRONMENT/*"
invalidation_response=$(curl --silent --show-error --fail --get \
    --data-urlencode "paths=[\"/$S3_KAIZEN_PATH/$ENVIRONMENT/*\"]" \
    --data-urlencode "distribution_id=${DOCS_CLOUDFRONT_ID}" \
    --data-urlencode "token=${CLOUDFRONT_INVALIDATION_TOKEN}" \
    "${CLOUDFRONT_INVALIDATION_LAMBDA_URL}")
if ! echo "$invalidation_response" | grep -qE '"status":[[:space:]]*"succ?ess"'; then
    echo "❌ CloudFront invalidation failed or returned an unexpected response: $invalidation_response"
    exit 1
fi
echo "✅ CloudFront invalidation requested: $invalidation_response"

echo "✅ Upload successful at $S3_FINAL_PATH"

