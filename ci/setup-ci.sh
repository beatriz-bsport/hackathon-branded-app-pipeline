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

set -e

# Install specific dependencies
echo "Installing required canvas dependencies ..."
apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev

# Install python 3.12 bc node-gyp requires it
echo "Installing python for node-gyp ..."
apk add --no-cache python3 make g++ py3-pip

# Manually link Python3 to Python if necessary
if ! command -v python3 &>/dev/null; then
    echo "Linking python3 to python..."
    ln -sf /usr/bin/python3 /usr/bin/python
fi

# Verify Python installation
echo "Python version installed:"
python3 --version || { echo "Python3 not installed properly!"; exit 1; }
python --version || { echo "Python not installed properly!"; exit 1; }

# Install project dependencies
echo "Installing project dependencies..."
pnpm install

# Install git and aws-cli
echo "Installing git and aws-cli..."
apk add --no-cache git aws-cli

echo "Setup completed successfully."
