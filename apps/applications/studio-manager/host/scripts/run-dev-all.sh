#!/bin/sh

set -e

APPLICATIONS=$(cat ./scripts/apps.txt)


# Check the first arg
MODE=$1

# Check for --debug argument
DEBUG=false
if [ "$MODE" = "--debug" ] || [ "$2" = "--debug" ]; then
  DEBUG=true
fi

# Define a command to run in different mode
command()
{
    if [ "$MODE" = "--build:preview" ]; then
        echo "pnpm --filter $APPLICATION build:preview > /dev/null 2>&1 && pnpm --filter $APPLICATION preview"
    else 
        echo "pnpm --filter $APPLICATION dev:single"
    fi
}

# Initialize variables
CONCURRENTLY_COMMANDS=""
CONCURRENTLY_NAMES=""

for APPLICATION in $APPLICATIONS; do
    # Append to names list
    NAME=$(echo "$APPLICATION" | sed 's/@bsport\///')
    CONCURRENTLY_NAMES="$CONCURRENTLY_NAMES $NAME,"

    echo "Run app $NAME"

    # Display the running port only on debug or the host
    if [ "$DEBUG" = true ] || [ "$APPLICATION" = "@bsport/sm-host" ]; then
        CONCURRENTLY_COMMANDS="$CONCURRENTLY_COMMANDS \"$(command $APPLICATION)\""
    else
        # Redirect output to null for non-host apps
        CONCURRENTLY_COMMANDS="$CONCURRENTLY_COMMANDS \"$(command $APPLICATION) > /dev/null 2>&1\""
    fi
done

# Remove trailing comma
CONCURRENTLY_NAMES=$(echo "$CONCURRENTLY_NAMES" | sed 's/,$//')

# # Use eval to expand the quoted string as separate args
eval pnpm exec concurrently --names \"$CONCURRENTLY_NAMES\" $CONCURRENTLY_COMMANDS
