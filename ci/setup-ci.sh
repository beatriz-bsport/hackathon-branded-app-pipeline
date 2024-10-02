#!/bin/sh

# Install pnpm
if ! command -v pnpm &> /dev/null
then
    echo "Installing pnpm..."
    npm install -g pnpm@9.11.0
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
