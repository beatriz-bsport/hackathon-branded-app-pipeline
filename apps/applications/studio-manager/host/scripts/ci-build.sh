#!/bin/sh

set -eu

echo "*"

DEFAULT_APPLICATIONS="@bsport/sm-host,@bsport/sm-navigation-sidebar"
RAW_APPLICATIONS=${1:-$DEFAULT_APPLICATIONS}
APPLICATIONS=$(printf "%b" "$RAW_APPLICATIONS" | tr '\n ' ',' | sed 's/,,*/,/g; s/^,//; s/,$//')

if [ -z "$APPLICATIONS" ]; then
  APPLICATIONS="$DEFAULT_APPLICATIONS"
fi

TODAY="$(date +%F)"
RELEASE_NAME="release-${TODAY}-${CI_COMMIT_SHORT_SHA:-local}"

echo "*"
echo "⏳ Building Studio Manager applications ($RELEASE_NAME)"

pnpm exec nx run-many --projects="$APPLICATIONS" --target=build

echo "✅ Success"
echo "*"
