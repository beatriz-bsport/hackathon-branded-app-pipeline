#!/bin/sh

set -e

# List of applications to build, for now we have this fixed list of applications
# when all the others are ready we could run all of them using a name filter 
# given all start with @bsport/sm-
APPLICATIONS="@bsport/sm-host,@bsport/sm-navigation-sidebar"

echo "*"
echo "⏳ Building Studio Manager applications"

pnpm exec nx run-many --projects="$APPLICATIONS" --target=build

echo "✅ Success"
echo "*"
