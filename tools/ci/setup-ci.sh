#!/bin/sh

set -e

# Read pnpm version from .npmrc
pnpm_version=$(grep pnpm_version .npmrc | cut -d '=' -f 2)

# Install pnpm if it's not already installed
if ! command -v pnpm &> /dev/null
then
    if [ -n "$pnpm_version" ]; then
        echo "Installing pnpm version $pnpm_version..."
        npm install -g pnpm@$pnpm_version
    else
        echo "pnpm version not found in .npmrc. Please specify a version."
        exit 1
    fi
else
    echo "pnpm is already installed."
fi

# Retrieve /storage folder from Docker Image fs
echo "*"
echo "1) Move /storage folder from Docker Image filesystem to runner local filesystem"
mv /storage .
echo "✅ Size of the folder : $(du -hs storage)"

# Tell pnpm to use /storage/pnpm-store as pnpm store
echo "*"
echo "2) Relocate pnpm store path to /storage/pnpm-store"
PNPM_HOME="$(realpath .)/storage"
PATH="$PNPM_HOME:$PATH"
PNPM_STORE_PATH="$PNPM_HOME/pnpm-store"
pnpm config set store-dir $PNPM_STORE_PATH
echo "✅ Successfully configured pnpm store at : $(pnpm store path)"

# Install project dependencies
echo "*"
echo "Install project dependencies by using the imported store..."
pnpm install --frozen-lockfile --prefer-offline

echo "✅ Successfully installed node_modules !"
echo "Store dir is : $(cat node_modules/.modules.yaml | grep 'storeDir')"

echo "*"
echo "✅ Setup finalized !"
