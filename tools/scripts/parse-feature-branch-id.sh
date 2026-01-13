#!/bin/bash

# Usage: ./parse-feature-branch-id.sh <tag_or_env_var>

INPUT="$1"
echo "Parsing the following input: $INPUT"

# Initialize outputs
FEATURE_BRANCH_IDENTIFIER=""
FORCE="false"
FRONTEND_ONLY="false"

# Parse FORCE
if [[ "$INPUT" == *-force ]]; then
    FORCE="true"
    # Remove -force for further processing
    INPUT="${INPUT%-force}"
fi

# Parse FRONTEND_ONLY
if [[ "$INPUT" == deploy-frontend-only-* ]]; then
    FRONTEND_ONLY="true"
    FEATURE_BRANCH_IDENTIFIER=$(echo "$INPUT" | sed -n 's/.*deploy-frontend-only-\([[:alnum:]_-]\+\)$/\1/p')
else
    FEATURE_BRANCH_IDENTIFIER=$(echo "$INPUT" | sed -n 's/.*deploy-\([[:alnum:]_-]\+\)$/\1/p')
fi

# Output results
echo "FEATURE_BRANCH_IDENTIFIER=$FEATURE_BRANCH_IDENTIFIER"
echo "FORCE=$FORCE"
echo "FRONTEND_ONLY=$FRONTEND_ONLY"

# Export results
export FEATURE_BRANCH_IDENTIFIER="$FEATURE_BRANCH_IDENTIFIER"
export FORCE="$FORCE"
export FRONTEND_ONLY="$FRONTEND_ONLY"
