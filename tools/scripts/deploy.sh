#!/bin/bash

set -euo pipefail

# Deploy script for CI/CD pipelines
# This script handles both environment deployments (dev/staging/production) and feature branch deployments
#
# Usage:
#   deploy.sh <base_branch> <deploy_environment> [api_environment] [frontend_only_flag]
#
# Arguments:
#   base_branch: The branch to compare against for affected projects (e.g., origin/dev, $CI_COMMIT_BEFORE_SHA)
#   deploy_environment: Where to deploy - passed to ci:build/ci:deploy (e.g., dev, staging, production, feature-branch)
#   api_environment: Optional. API config - passed to api-environment:set (defaults to deploy_environment)
#   frontend_only_flag: Optional. Pass "frontend-only" for frontend-only deployments

BASE_BRANCH=$1
DEPLOY_ENVIRONMENT=$2
API_ENVIRONMENT=${3:-$2}
FRONTEND_ONLY_FLAG=${4:-""}

if [ -z "$BASE_BRANCH" ] || [ -z "$DEPLOY_ENVIRONMENT" ]; then
  echo "❌ Error: Missing required arguments"
  echo "Usage: deploy.sh <base_branch> <deploy_environment> [api_environment] [frontend_only_flag]"
  exit 1
fi

echo "=========================================="
echo "🚀 Starting deployment"
echo "=========================================="
echo "Base branch: $BASE_BRANCH"
echo "Deploy environment: $DEPLOY_ENVIRONMENT"
echo "API environment: $API_ENVIRONMENT"
echo "Frontend only: ${FRONTEND_ONLY_FLAG:-false}"
echo "=========================================="
echo ""

# Fetch the base branch/commit if needed
echo "⏳ Fetching base branch..."
if [[ "$BASE_BRANCH" == *"/"* ]]; then
  # Branch reference (e.g., origin/dev)
  REMOTE=$(echo "$BASE_BRANCH" | cut -d'/' -f1)
  BRANCH=$(echo "$BASE_BRANCH" | cut -d'/' -f2-)
  git fetch "$REMOTE" "$BRANCH" 2>/dev/null || echo "Branch already fetched"
  # For Nx commands, use the full ref (origin/dev)
  NX_BASE="$BASE_BRANCH"
else
  # Commit SHA - fetch it from origin
  git fetch origin "$BASE_BRANCH" 2>/dev/null || echo "⚠️  Could not fetch commit $BASE_BRANCH"
  # For Nx commands, use the SHA directly
  NX_BASE="$BASE_BRANCH"
fi
echo "✅ Base reference ready"
echo ""

# Build translations
echo "⏳ Building translations"
pnpm run -w translation:update
echo "✅ Translations have been updated"
echo ""

# Set API environment
echo "⏳ Setting API environment"
pnpm run -w api-environment:set $API_ENVIRONMENT
echo "✅ API environment has been set"
echo ""

# Set Feature Flag environment
echo "⏳ Setting Feature Flag environment"
pnpm run -w feature-flags-environment:set $API_ENVIRONMENT
echo "✅ Feature Flag environment has been set"
echo ""

# Show affected projects
echo "🔱 Detecting affected projects..."
AFFECTED_PROJECTS=$(pnpm exec nx show projects --affected --base="$NX_BASE" --head=HEAD)
echo "These are the affected projects:"
echo "$AFFECTED_PROJECTS"
echo ""

# Filter Studio Manager projects
SM_AFFECTED_PROJECTS=$(echo "$AFFECTED_PROJECTS" | grep -E "^@bsport/sm-" | tr ' ' '\n' || echo "")
echo "🔱 These are the SM affected projects:"
if [ -n "$SM_AFFECTED_PROJECTS" ]; then
  echo "$SM_AFFECTED_PROJECTS"
else
  echo "(none)"
fi
echo ""

# Build affected projects
echo "⏳ Building affected projects and their dependencies"
if [ "$FRONTEND_ONLY_FLAG" = "frontend-only" ]; then
  pnpm exec nx affected --target=ci:build --base="$NX_BASE" --head=HEAD "$DEPLOY_ENVIRONMENT" true
else
  pnpm exec nx affected --target=ci:build --base="$NX_BASE" --head=HEAD "$DEPLOY_ENVIRONMENT"
fi
echo "✅ All affected projects have been rebuilt"
echo ""

# Deploy affected projects
echo "⏳ Deploying affected projects"
if [ "$FRONTEND_ONLY_FLAG" = "frontend-only" ]; then
  pnpm exec nx affected --target=ci:deploy --base="$NX_BASE" --head=HEAD "$DEPLOY_ENVIRONMENT" true
else
  pnpm exec nx affected --target=ci:deploy --base="$NX_BASE" --head=HEAD "$DEPLOY_ENVIRONMENT"
fi
echo "✅ All affected projects have been deployed"
echo ""

# Handle Studio Manager micro frontends
if [ -n "$SM_AFFECTED_PROJECTS" ]; then
  echo "⏳ Building affected micro frontends"
  pnpm --filter=@bsport/sm-host ci:build:mfe "$SM_AFFECTED_PROJECTS"
  echo "✅ All affected micro frontends have been rebuilt"
  echo ""
  
  echo "⏳ Deploying affected micro frontends"
  pnpm --filter=@bsport/sm-host ci:deploy:mfe "$DEPLOY_ENVIRONMENT" "$SM_AFFECTED_PROJECTS"
  echo "✅ All affected micro frontends have been deployed"
else
  echo "ℹ️  No Studio Manager projects affected, skipping micro frontend deployment"
fi
echo ""

echo "=========================================="
echo "✅ Deployment completed successfully"
echo "=========================================="
