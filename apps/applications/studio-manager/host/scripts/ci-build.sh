#!/bin/sh

set -e

echo "*"

# Clean provided list (1st arg) by converting literal \n to comma separator
APPLICATIONS=$(echo $(printf "%b" "$1") | sed "s/ /,/g")

# Always include sm-host to ensure release SHA can be injected during deployment of MFE
# Example: when sm-navigation-sidebar only is affected 
if ! echo "$APPLICATIONS" | grep -q "@bsport/sm-host"; then
  echo "Adding @bsport/sm-host to build list for release SHA injection"
  APPLICATIONS="@bsport/sm-host,$APPLICATIONS"
fi

TODAY="$(date +%F)"
RELEASE_NAME="release-${TODAY}-${CI_COMMIT_SHORT_SHA:-local}"

echo "*"
echo "⏳ Building Studio Manager applications ($RELEASE_NAME)"

VITE_RELEASE_NAME=$RELEASE_NAME pnpm exec nx run-many --projects="$APPLICATIONS" --target=build

echo "✅ Success"
echo "*"
