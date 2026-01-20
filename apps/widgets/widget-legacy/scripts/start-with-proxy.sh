#!/bin/bash

# Startup script using Node.js proxy instead of nginx
# Use this if you don't have Docker or prefer a pure Node.js solution
#
# Usage:
#   ./start-with-proxy.sh         # Default: dev environment
#   ./start-with-proxy.sh dev     # Dev environment
#   ./start-with-proxy.sh prod    # Production environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WIDGET_DIR="$(dirname "$SCRIPT_DIR")"
ICHIZEN_ROOT="$(cd "$WIDGET_DIR/../../.." && pwd)"

# Parse environment argument (default to dev)
ENV="${1:-dev}"

# Validate environment
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
    echo "❌ Error: Invalid environment '$ENV'. Use 'dev' or 'prod'."
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [[ "$ENV" == "prod" ]]; then
    echo -e "${RED}🚀 Starting development environment with Node.js reverse proxy (PRODUCTION BACKEND)${NC}"
else
    echo "🚀 Starting development environment with Node.js reverse proxy (DEV BACKEND)"
fi
echo ""

# Check if required directories exist
SAAS_LEGACY_DIR="$ICHIZEN_ROOT/apps/applications/saas-legacy"
PROXY_BRIDGE_DIR="$ICHIZEN_ROOT/apps/widgets/widget-proxy-bridge"
WIDGET_DEBUGGER_DIR="$ICHIZEN_ROOT/apps/tools/widget-debugger"

if [ ! -d "$SAAS_LEGACY_DIR" ]; then
    echo "❌ Error: saas-legacy directory not found at $SAAS_LEGACY_DIR"
    exit 1
fi

if [ ! -d "$PROXY_BRIDGE_DIR" ]; then
    echo "❌ Error: widget-proxy-bridge directory not found at $PROXY_BRIDGE_DIR"
    exit 1
fi

if [ ! -d "$WIDGET_DEBUGGER_DIR" ]; then
    echo "❌ Error: widget-debugger directory not found at $WIDGET_DEBUGGER_DIR"
    exit 1
fi

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."

    # Kill background processes
    jobs -p | xargs -r kill 2>/dev/null || true

    echo "✅ All services stopped"
    exit 0
}

trap cleanup EXIT INT TERM

# Set API environment for production
if [[ "$ENV" == "prod" ]]; then
    echo -e "${YELLOW}⚠️  WARNING: This will connect to PRODUCTION API${NC}"
    echo -e "${BLUE}🔧 Setting API environment to production...${NC}"
    cd "$ICHIZEN_ROOT"
    pnpm run -w api-environment:set production --quiet
fi

# Start Node.js proxy
echo -e "${BLUE}🔀 Starting Node.js reverse proxy (port 8088)...${NC}"
cd "$WIDGET_DIR"
node dev-proxy-server.js > /tmp/dev-proxy.log 2>&1 &
PROXY_SERVER_PID=$!

# Wait for proxy to start
sleep 2

echo -e "${BLUE}🎨 Starting widget dev server (port 3100)...${NC}"
cd "$WIDGET_DIR"
pnpm run start > /tmp/widget-dev.log 2>&1 &
WIDGET_PID=$!

# Start saas-legacy with appropriate command
if [[ "$ENV" == "prod" ]]; then
    echo -e "${BLUE}🌐 Starting main website dev server with PRODUCTION API (port 3000)...${NC}"
    cd "$SAAS_LEGACY_DIR"
    pnpm run debug-only:start:production > /tmp/saas-legacy-dev.log 2>&1 &
else
    echo -e "${BLUE}🌐 Starting main website dev server (port 3000)...${NC}"
    cd "$SAAS_LEGACY_DIR"
    pnpm run start-dev > /tmp/saas-legacy-dev.log 2>&1 &
fi
SAAS_PID=$!

echo -e "${BLUE}🔌 Starting proxy bridge dev server (port 4048)...${NC}"
cd "$PROXY_BRIDGE_DIR"
pnpm run dev > /tmp/proxy-bridge-dev.log 2>&1 &
PROXY_BRIDGE_PID=$!

echo -e "${BLUE}🔌 Starting widget debugger dev server (port 3211)...${NC}"
cd "$WIDGET_DEBUGGER_DIR"
pnpm run serve:html > /tmp/widget-debugger-dev.log 2>&1 &
WIDGET_DEBUGGER_PID=$!


cd "$ICHIZEN_ROOT"

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo -e "${GREEN}✅ Development environment ready!${NC}"
echo ""

if [[ "$ENV" == "prod" ]]; then
    echo -e "${RED}⚠️  CONNECTED TO PRODUCTION API - BE CAREFUL WITH YOUR ACTIONS${NC}"
else
    echo "⚠️ Be sure to run pnpm run -w api-environment:set ... so that fetch package is configured"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📍 Access your application at:${NC}"
echo ""
echo -e "   ${GREEN}http://localhost:8088${NC}"
echo ""
echo "   All services are now running on the SAME origin!"
echo "   - Main website: http://localhost:8088/"
echo "   - Proxy: http://localhost:8088/widget-proxy-bridge/"
echo ""
echo "   ✨ localStorage is now shared between all services ✨"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Individual dev servers (for debugging):"
echo "   - Widget:  http://localhost:3100"
echo "   - Website: http://localhost:3000"
echo "   - Proxy:   http://localhost:4048"
echo "   - Widget Debugger: http://localhost:3211"
echo ""
echo "Logs:"
echo "   - Proxy:   tail -f /tmp/dev-proxy.log"
echo "   - Widget:  tail -f /tmp/widget-dev.log"
echo "   - Website: tail -f /tmp/saas-legacy-dev.log"
echo "   - Bridge:  tail -f /tmp/proxy-bridge-dev.log"
echo "   - Widget Debugger: tail -f /tmp/widget-debugger-dev.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
