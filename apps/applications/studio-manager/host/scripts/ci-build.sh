#!/bin/sh

set -e

echo "*"

# List of applications to build
# Check if argument is provided (SM_AFFECTED_PROJECTS)
if [ -n "$1" ]; then
  # Use the provided list of affected projects
  echo "Using provided list of affected projects"
  # Convert literal \n to comma separator
  APPLICATIONS=$(echo $(printf "%b" "$1") | sed "s/ /,/g")
else
  # Fall back to the fixed list of applications from apps.txt
  echo "Using fixed list of applications from apps.txt"
  APPLICATIONS=$(cat ./scripts/apps.txt)
fi

TODAY="$(date +%F)"
RELEASE_NAME="release-${TODAY}-${CI_COMMIT_SHORT_SHA:-local}"

echo "*"
echo "⏳ Building Studio Manager applications ($RELEASE_NAME)"

VITE_RELEASE_NAME=$RELEASE_NAME pnpm exec nx run-many --projects="$APPLICATIONS" --target=build

echo "✅ Success"
echo "*"
