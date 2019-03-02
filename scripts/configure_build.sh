#!/bin/sh

SENTRY_DSN=$(echo "$SENTRY_DSN" | sed -e 's/[\/&]/\\&/g')
STRIPE_PK_KEY=$(echo "$STRIPE_PK_KEY" | sed -e 's/[\/&]/\\&/g')
GOOGLE_MAPS_API_KEY=$(echo "$GOOGLE_MAPS_API_KEY" | sed -e 's/[\/&]/\\&/g')
BASE_URI=$(echo "$BASE_URI" | sed -e 's/[\/&]/\\&/g')

sed -e "s/\${SENTRY_DSN}/$SENTRY_DSN/" \
    -e "s/\${STRIPE_PK_KEY}/$STRIPE_PK_KEY/" \
    -e "s/\${GOOGLE_MAPS_API_KEY}/$GOOGLE_MAPS_API_KEY/" \
    -e "s/\${BASE_URI}/$BASE_URI/" \
    build/env.template.js > build/env.js
