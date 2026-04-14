#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
TARGET_BASE_DIR="${STUDIO_RUNTIME_APP_DIR:-$(pwd)}"
TARGET_DIR="$TARGET_BASE_DIR/public/studio"
TARGET_FILE="$TARGET_DIR/studio-env.js"
DEFAULT_RUNTIME_ENV=dev

resolve_source_file() {
  runtime_env="${1:-$DEFAULT_RUNTIME_ENV}"

  if [ -n "${STUDIO_RUNTIME_ENV_FILE:-}" ]; then
    case "$STUDIO_RUNTIME_ENV_FILE" in
      /*) source_file="$STUDIO_RUNTIME_ENV_FILE" ;;
      *)
        if [ -f "$(pwd)/$STUDIO_RUNTIME_ENV_FILE" ]; then
          source_file="$(pwd)/$STUDIO_RUNTIME_ENV_FILE"
        else
          source_file="$REPO_ROOT/$STUDIO_RUNTIME_ENV_FILE"
        fi
        ;;
    esac
  else
    source_file="$REPO_ROOT/apps/applications/studio-manager/host/envs/${runtime_env}.studio-env.js"
  fi

  if [ -f "$source_file" ]; then
    printf "%s\n" "$source_file"
    return 0
  fi

  return 1
}

copy_runtime_file() {
  runtime_env="${1:-$DEFAULT_RUNTIME_ENV}"
  source_file=$(resolve_source_file "$runtime_env") || return 1
  mkdir -p "$TARGET_DIR"
  cp "$source_file" "$TARGET_FILE"
}

set_runtime() {
  runtime_env="${1:-${STUDIO_RUNTIME_ENV:-$DEFAULT_RUNTIME_ENV}}"

  if ! copy_runtime_file "$runtime_env"; then
    if [ -n "${STUDIO_RUNTIME_ENV_FILE:-}" ]; then
      echo "Missing studio runtime source file: $STUDIO_RUNTIME_ENV_FILE" >&2
    else
      echo "Missing studio runtime source file for env '$runtime_env'" >&2
    fi
    return 1
  fi

  return 0
}

command="${1:-set}"

case "$command" in
  set)
    set_runtime "${2:-${STUDIO_RUNTIME_ENV:-$DEFAULT_RUNTIME_ENV}}"
    ;;
  *)
    # Backward compatibility: passing an env name directly behaves like `set <env>`.
    set_runtime "$command"
    ;;
esac
