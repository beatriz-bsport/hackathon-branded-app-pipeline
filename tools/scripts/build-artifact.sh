#!/bin/bash

set -euo pipefail

STUDIO_MFE="@bsport/sm-host,@bsport/sm-navigation-sidebar"
ARTIFACT_BUCKET_NAME="${ARTIFACT_BUCKET_NAME:-bsport-frontends-artifacts-euw3}"
ARTIFACT_MODE="${ARTIFACT_MODE:-backoffice}"
ARTIFACT_VERSION="${ARTIFACT_VERSION:-${CI_COMMIT_SHORT_SHA:-}}"
RELEASE_SHA="${CI_COMMIT_SHORT_SHA:-local}"
RELEASE_COMMIT_SHA="${CI_COMMIT_SHA:-$RELEASE_SHA}"
SENTRY_RELEASE="${SENTRY_RELEASE:-$(cat apps/applications/saas-legacy/VERSION)-$RELEASE_SHA}"
SENTRY_REPOSITORY="${SENTRY_REPOSITORY:-${CI_PROJECT_PATH:-}}"
BACKOFFICE_FRONTEND_URL="${BACKOFFICE_FRONTEND_URL:-backoffice.dev.bsport.io}"

BACKOFFICE_ARTIFACT_PREFIX="${BACKOFFICE_ARTIFACT_PREFIX:-backoffice}"
WIDGET_ARTIFACT_PREFIX="${WIDGET_ARTIFACT_PREFIX:-widget}"
KAIZEN_DOCS_ARTIFACT_PREFIX="${KAIZEN_DOCS_ARTIFACT_PREFIX:-kaizen-docs}"
KAIZEN_STORYBOOK_ARTIFACT_PREFIX="${KAIZEN_STORYBOOK_ARTIFACT_PREFIX:-kaizen-storybook}"

ARTIFACT_IMMUTABLE_CACHE_CONTROL="${ARTIFACT_IMMUTABLE_CACHE_CONTROL:-max-age=31536000,public}"
ARTIFACT_NO_CACHE_CONTROL="${ARTIFACT_NO_CACHE_CONTROL:-max-age=0,no-cache,no-store,must-revalidate}"

BUILD_ROOT="build"
BACKOFFICE_BUILD_DIR="$BUILD_ROOT/backoffice"
WIDGET_BUILD_DIR="$BUILD_ROOT/widget"
KAIZEN_DOCS_BUILD_DIR="$BUILD_ROOT/kaizen-docs"
KAIZEN_STORYBOOK_BUILD_DIR="$BUILD_ROOT/kaizen-storybook"

case "$ARTIFACT_MODE" in
  backoffice|release)
    ;;
  *)
    echo "❌ Error: invalid ARTIFACT_MODE: $ARTIFACT_MODE"
    echo "Expected ARTIFACT_MODE=backoffice or ARTIFACT_MODE=release"
    exit 1
    ;;
esac

if [ -z "$ARTIFACT_VERSION" ]; then
  echo "❌ Error: ARTIFACT_VERSION or CI_COMMIT_SHORT_SHA is required"
  exit 1
fi

require_release_file() {
  local path="$1"

  if [ ! -f "$path" ]; then
    echo "❌ Error: missing release artifact file: $path"
    exit 1
  fi
}

artifact_s3_url() {
  local artifact_prefix="$1"
  local artifact_version="$2"

  printf 's3://%s/%s/%s' "$ARTIFACT_BUCKET_NAME" "$artifact_prefix" "$artifact_version"
}

remove_sourcemaps_from_s3_prefix() {
  local s3_url="$1"

  aws s3 rm "$s3_url" \
    --recursive \
    --only-show-errors \
    --exclude "*" \
    --include "*.map" \
    --include "*.map.*"
}

upload_web_artifact() {
  local source_dir="$1"
  local s3_url="$2"

  aws s3 sync "$source_dir/" "$s3_url" \
    --only-show-errors \
    --delete \
    --cache-control "$ARTIFACT_IMMUTABLE_CACHE_CONTROL" \
    --exclude "*.map" \
    --exclude "*.map.*"

  aws s3 cp "$source_dir/" "$s3_url" \
    --recursive \
    --only-show-errors \
    --cache-control "$ARTIFACT_NO_CACHE_CONTROL" \
    --exclude "*" \
    --include "index.html" \
    --include "*/index.html" \
    --include "env.js" \
    --include "studio-env.js" \
    --include "version.json" \
    --include "manifest.json" \
    --include "asset-manifest.json" \
    --include "service-worker.js" \
    --include "*.json" \
    --include "locales/*" \
    --include "locales/*/*.json"

  remove_sourcemaps_from_s3_prefix "$s3_url"
}

upload_widget_artifact() {
  local source_dir="$1"
  local s3_url="$2"

  aws s3 sync "$source_dir/" "$s3_url" \
    --only-show-errors \
    --delete \
    --cache-control "$ARTIFACT_IMMUTABLE_CACHE_CONTROL" \
    --exclude "widget.js" \
    --exclude "*.map" \
    --exclude "*.map.*"

  aws s3 cp "$source_dir/widget.js" "$s3_url/widget.js" \
    --only-show-errors \
    --cache-control "$ARTIFACT_NO_CACHE_CONTROL" \
    --content-type application/javascript

  remove_sourcemaps_from_s3_prefix "$s3_url"
}

prepare_backoffice_sentry_release() {
  if ! compgen -G "$BACKOFFICE_BUILD_DIR/static/js/*.js.map" > /dev/null; then
    echo "No backoffice sourcemaps found; skipping Sentry release upload."
    return 0
  fi

  echo "⏳ Preparing Sentry release $SENTRY_RELEASE"
  export SENTRY_NO_PROGRESS_BAR=1

  if pnpm --filter @bsport/saas-legacy exec sentry-cli releases info "$SENTRY_RELEASE" > /dev/null 2>&1; then
    echo "Sentry release $SENTRY_RELEASE already exists; uploading sourcemaps again to make retries safe."
  else
    pnpm --filter @bsport/saas-legacy exec sentry-cli releases new "$SENTRY_RELEASE"
  fi

  if [ -n "$SENTRY_REPOSITORY" ] && [ "$RELEASE_COMMIT_SHA" != "local" ]; then
    pnpm --filter @bsport/saas-legacy exec sentry-cli releases set-commits "$SENTRY_RELEASE" --commit "$SENTRY_REPOSITORY@$RELEASE_COMMIT_SHA" || echo "Could not set Sentry commits for $SENTRY_RELEASE; continuing."
  else
    echo "No artifact commit metadata available; skipping Sentry commit association."
  fi

  pnpm --filter @bsport/saas-legacy exec sentry-cli releases files "$SENTRY_RELEASE" upload-sourcemaps \
    --validate \
    --url-prefix "https://$BACKOFFICE_FRONTEND_URL/static/js/" \
    --ignore 'node_modules/' \
    --rewrite \
    "$BACKOFFICE_BUILD_DIR/static/js/"
  pnpm --filter @bsport/saas-legacy exec sentry-cli releases finalize "$SENTRY_RELEASE" || echo "Sentry release $SENTRY_RELEASE may already be finalized; continuing."
}

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

if [ "$ARTIFACT_MODE" = "release" ]; then
  pnpm --filter @bsport/widget-legacy ci:build dev

  echo "⏳ Building Kaizen docs"
  pnpm -C apps/docs install --frozen-lockfile --prefer-offline
  pnpm -C apps/docs ci:build

  echo "⏳ Building Kaizen Storybook"
  (
    cd packages/design-system/kaizen/storybook
    STORYBOOK_ENV=dev STORYBOOK_COMMIT_SHORT_SHA="$RELEASE_SHA" NODE_OPTIONS=--max-old-space-size=8192 pnpm storybook:build --quiet --output-dir storybook-static
  )
fi

echo "✅ All projects have been rebuilt"

echo "⏳ Aggregating projects into dedicated build outputs"
rm -rf "$BUILD_ROOT"
mkdir -p "$BACKOFFICE_BUILD_DIR/studio/apps"
cp -r apps/applications/saas-legacy/build/* "$BACKOFFICE_BUILD_DIR/"
cp -r apps/widgets/widget-proxy-bridge/dist "$BACKOFFICE_BUILD_DIR/widget-proxy-bridge"
cp -r apps/applications/studio-manager/host/dist/* "$BACKOFFICE_BUILD_DIR/studio/"
cp -r apps/applications/studio-manager/navigation-sidebar/dist "$BACKOFFICE_BUILD_DIR/studio/apps/navigation-sidebar"
rm -rf "$BACKOFFICE_BUILD_DIR/studio/apps/host"

if [ -f "$BACKOFFICE_BUILD_DIR/studio/index.html" ]; then
  sed -i'' -e "s/__RELEASE_SHA_PLACEHOLDER__/$RELEASE_SHA/g" "$BACKOFFICE_BUILD_DIR/studio/index.html"
fi

if [ "$ARTIFACT_MODE" = "release" ]; then
  mkdir -p "$WIDGET_BUILD_DIR"
  mkdir -p "$KAIZEN_DOCS_BUILD_DIR"
  mkdir -p "$KAIZEN_STORYBOOK_BUILD_DIR"
  cp -r apps/widgets/widget-debugger/src/html "$BACKOFFICE_BUILD_DIR/widget-debugger"
  cp -r apps/widgets/widget-legacy/dist/* "$WIDGET_BUILD_DIR/"
  cp -r apps/docs/dist/* "$KAIZEN_DOCS_BUILD_DIR/"
  cp -r packages/design-system/kaizen/storybook/storybook-static/* "$KAIZEN_STORYBOOK_BUILD_DIR/"
fi

if [ "$ARTIFACT_MODE" = "release" ]; then
  require_release_file "$BACKOFFICE_BUILD_DIR/index.html"
  require_release_file "$WIDGET_BUILD_DIR/widget.js"
  require_release_file "$KAIZEN_DOCS_BUILD_DIR/index.html"
  require_release_file "$KAIZEN_STORYBOOK_BUILD_DIR/index.html"

  prepare_backoffice_sentry_release
fi

echo "✅ Build outputs aggregated successfully"

echo "⏳ Pushing build outputs to S3 for deployment"
upload_web_artifact "$BACKOFFICE_BUILD_DIR" "$(artifact_s3_url "$BACKOFFICE_ARTIFACT_PREFIX" "$ARTIFACT_VERSION")"

if [ "$ARTIFACT_MODE" = "release" ]; then
  upload_widget_artifact "$WIDGET_BUILD_DIR" "$(artifact_s3_url "$WIDGET_ARTIFACT_PREFIX" "$ARTIFACT_VERSION")"
  upload_web_artifact "$KAIZEN_DOCS_BUILD_DIR" "$(artifact_s3_url "$KAIZEN_DOCS_ARTIFACT_PREFIX" "$ARTIFACT_VERSION")"
  upload_web_artifact "$KAIZEN_STORYBOOK_BUILD_DIR" "$(artifact_s3_url "$KAIZEN_STORYBOOK_ARTIFACT_PREFIX" "$ARTIFACT_VERSION")"
fi

echo "✅ Artifacts pushed to S3 successfully"

if [ "${CI_COMMIT_BRANCH:-}" = "dev" ]; then
  echo "⏳ Tagging latest dev build artifacts"
  upload_web_artifact "$BACKOFFICE_BUILD_DIR" "$(artifact_s3_url "$BACKOFFICE_ARTIFACT_PREFIX" "dev")"

  if [ "$ARTIFACT_MODE" = "release" ]; then
    upload_widget_artifact "$WIDGET_BUILD_DIR" "$(artifact_s3_url "$WIDGET_ARTIFACT_PREFIX" "dev")"
    upload_web_artifact "$KAIZEN_DOCS_BUILD_DIR" "$(artifact_s3_url "$KAIZEN_DOCS_ARTIFACT_PREFIX" "dev")"
    upload_web_artifact "$KAIZEN_STORYBOOK_BUILD_DIR" "$(artifact_s3_url "$KAIZEN_STORYBOOK_ARTIFACT_PREFIX" "dev")"
  fi

  echo "✅ Dev tags updated"
fi
