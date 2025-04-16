#!/bin/sh

set -e

echo "*"

# List of applications to build, for now we have this fixed list of applications
# when all the others are ready we could run all of them using a name filter 
# given all start with @bsport/sm-
APPLICATIONS=$(cat ./scripts/apps.txt)

echo "*"
echo "⏳ Building Studio Manager applications"

# pnpm exec nx run-many --projects="$APPLICATIONS" --target=build
for APPLICATION in $APPLICATIONS; do
  echo "> Building $APPLICATION"
  pnpm --filter=$APPLICATION... build
done

echo "✅ Success"
echo "*"
