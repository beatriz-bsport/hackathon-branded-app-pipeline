#!/bin/sh

set -e

# Produces a production-like bundle of every app that ships in the saas-legacy
# S3 bucket (saas-legacy, studio-manager host + navigation-sidebar,
# widget-proxy-bridge, widget-debugger) and serves it behind a local server
# that emulates the CloudFront rewrite function running in production.
#
# See:
#   - bsport-terraform/scripts/cloudfront_function_cdn_redirect.js
#   - ./serve-local-build.mjs

ENVIRONMENT="${1:-local-api}"
BUILD_DIR="build"
PORT="${PORT:-8080}"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
SAAS_LEGACY_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(git -C "$SAAS_LEGACY_DIR" rev-parse --show-toplevel)"

SM_HOST_DIR="$REPO_ROOT/apps/applications/studio-manager/host"
SM_SIDEBAR_DIR="$REPO_ROOT/apps/applications/studio-manager/navigation-sidebar"

# The revamped apps (studio-manager host, navigation-sidebar, widget-proxy-bridge)
# read their runtime config from /studio/studio-env.js, which overrides the
# production default baked into their index.html. Map the saas-legacy env name
# to the matching studio runtime env file so the apps point at the local API.
case "$ENVIRONMENT" in
  local*)         STUDIO_RUNTIME_ENV="local" ;;
  dev*)           STUDIO_RUNTIME_ENV="dev" ;;
  staging*)       STUDIO_RUNTIME_ENV="staging" ;;
  production*)    STUDIO_RUNTIME_ENV="production" ;;
  *)              STUDIO_RUNTIME_ENV="local" ;;
esac
STUDIO_RUNTIME_ENV_FILE="$SM_HOST_DIR/envs/$STUDIO_RUNTIME_ENV.studio-env.js"

cd "$SAAS_LEGACY_DIR"

printf "Recreate local build now? [y/N]: "
read -r REPLY

case "$REPLY" in
  [yY] | [yY][eE][sS])
    echo "⏳ Rebuilding all apps with the CI-compatible flow..."

    echo "━━━ @bsport/saas-legacy ($ENVIRONMENT) → ./$BUILD_DIR"
    ./scripts/ci-build.sh "$ENVIRONMENT"

    echo "━━━ Studio Manager (@bsport/sm-host + @bsport/sm-navigation-sidebar) → studio-manager/*/dist"
    (cd "$SM_HOST_DIR" && ./scripts/ci-build.sh)

    echo "📦 Assembling production-like bucket layout under ./$BUILD_DIR"

    # /studio  ← @bsport/sm-host dist
    rm -rf "$BUILD_DIR/studio"
    mkdir -p "$BUILD_DIR/studio"
    cp -R "$SM_HOST_DIR/dist/." "$BUILD_DIR/studio/"

    # /studio/apps/navigation-sidebar  ← @bsport/sm-navigation-sidebar dist
    # (the nx run-many invocation above builds the regular, non-compat dist)
    rm -rf "$BUILD_DIR/studio/apps/navigation-sidebar"
    mkdir -p "$BUILD_DIR/studio/apps/navigation-sidebar"
    cp -R "$SM_SIDEBAR_DIR/dist/." "$BUILD_DIR/studio/apps/navigation-sidebar/"

    # /studio/studio-env.js  ← runtime config consumed by sm-host AND
    # widget-proxy-bridge (both load /studio/studio-env.js from their index.html)
    if [ ! -f "$STUDIO_RUNTIME_ENV_FILE" ]; then
      echo "❌ Missing studio runtime env file: $STUDIO_RUNTIME_ENV_FILE"
      exit 1
    fi
    echo "🔧 Pointing revamped apps at '$STUDIO_RUNTIME_ENV' API via /studio/studio-env.js"
    cp "$STUDIO_RUNTIME_ENV_FILE" "$BUILD_DIR/studio/studio-env.js"

    echo "✅ Local bundle assembled in ./$BUILD_DIR"
    ;;
  *)
    echo "⏭️  Skipping rebuild and serving existing ./$BUILD_DIR"
    ;;
esac

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ No build directory found at ./$BUILD_DIR"
  echo "Run again and answer 'y' to rebuild first."
  exit 1
fi

echo "🚀 Serving ./$BUILD_DIR with CloudFront-like rewrites at http://localhost:$PORT"
exec node "$SCRIPT_DIR/serve-local-build.mjs" "$SAAS_LEGACY_DIR/$BUILD_DIR"
