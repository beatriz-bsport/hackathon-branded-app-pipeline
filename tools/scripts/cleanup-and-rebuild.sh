#!/bin/bash

# Complete pnpm cleanup and rebuild script
# This script performs a full cleanup of pnpm cache and dependencies, then rebuilds failed packages

set -Eeuo pipefail  # Fail fast: errors, unset vars, and pipelines

# Ensure required tools are available
command -v pnpm >/dev/null 2>&1 || { echo "Error: pnpm is required. See README for installation steps."; exit 127; }
pnpm exec nx --version >/dev/null 2>&1 || { echo "Error: Nx CLI is required (available via devDependencies). Run 'pnpm install' first."; exit 127; }

# Ensure we are at the workspace root
if [ ! -f "pnpm-workspace.yaml" ]; then
  echo "Error: pnpm-workspace.yaml not found. Run this script from the repository root."
  exit 1
fi

# Confirmation prompt
echo "⚠️  WARNING: This script will perform a complete cleanup of ALL projects in the workspace."
echo ""
echo "This will:"
echo "  • Remove all node_modules directories"
echo "  • Clear the global pnpm store (affects ALL projects on this machine)"
echo "  • Remove all pnpm cache files"
echo "  • Reinstall all dependencies from scratch"
echo "  • Rebuild all packages in the workspace"
echo ""
echo "This operation cannot be undone and may take several minutes to complete."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ -n $REPLY ]]; then
    echo "❌ Operation cancelled."
    exit 0
fi

echo "🧹 Starting complete pnpm cleanup and rebuild..."

# Step 1: Complete cleanup
echo "📦 Step 1: Cleaning up pnpm store and node_modules..."
pnpm store prune
rm -rf node_modules
rm -rf ~/.pnpm-store
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".pnpm" -type d -exec rm -rf {} + 2>/dev/null || true

# Step 2: Clear pnpm cache completely
echo "🗑️  Step 2: Clearing pnpm cache completely..."
STORE_PATH="$(pnpm store path 2>/dev/null || true)"
if [ -n "${STORE_PATH:-}" ] && [ -d "$STORE_PATH" ]; then
  echo "🗑️  Removing pnpm store at: $STORE_PATH"
  rm -rf "$STORE_PATH"
else
  echo "ℹ️  Skipping pnpm store removal (path not found)"
fi

# Step 3: Reinstall with clean slate and build all projects
echo "🏗️  Step 3: Reinstalling dependencies..."
pnpm install 

echo "✅ Cleanup and rebuild completed successfully!"
