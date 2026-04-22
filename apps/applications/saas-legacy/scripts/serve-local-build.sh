#!/bin/sh

set -e

ENVIRONMENT="${1:-local-api}"
BUILD_DIR="build"
PORT="${PORT:-8080}"

printf "Recreate local build now? [y/N]: "
read -r REPLY

case "$REPLY" in
  [yY] | [yY][eE][sS])
    echo "⏳ Rebuilding local artifact with CI-compatible flow..."
    ./scripts/ci-build.sh "$ENVIRONMENT"
    ;;
  *)
    echo "⏭️  Skipping rebuild and serving existing build."
    ;;
esac

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ No build directory found at ./$BUILD_DIR"
  echo "Run again and answer 'y' to rebuild first."
  exit 1
fi

echo "🚀 Serving ./$BUILD_DIR with SPA fallback at http://localhost:$PORT"
exec pnpm exec serve -s "$BUILD_DIR" -l "$PORT" --no-clipboard
