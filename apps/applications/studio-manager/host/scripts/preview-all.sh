#!/bin/sh

set -e

command()
{
    APPLICATION=$1
    echo "pnpm exec nx build:preview $APPLICATION > /dev/null && pnpm --filter $APPLICATION preview"
}

COMMAND_HOST="$(command @bsport/sm-host)"
COMMAND_SIDEBAR="$(command @bsport/sm-navigation-sidebar)"

CONCURRENTLY_NAMES="sm-host,sm-navigation-sidebar"
CONCURRENTLY_COMMANDS="\"$COMMAND_HOST\" \"$COMMAND_SIDEBAR\""

# Use eval to expand the quoted string as separate args
eval pnpm exec concurrently --names \"$CONCURRENTLY_NAMES\" $CONCURRENTLY_COMMANDS

# @todo Fix bug "Unable to load css"
