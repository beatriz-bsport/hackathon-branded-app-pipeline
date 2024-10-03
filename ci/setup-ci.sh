#!/bin/sh

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


# Install project dependencies
echo "Installing project dependencies..."
pnpm install

# Install git and aws-cli
echo "Installing git and aws-cli..."
apk add --no-cache git aws-cli

echo "Setup completed successfully."
