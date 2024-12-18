#!/bin/sh
. .env.$1
export $(cut -d= -f1 .env.$1)
envsubst < public/env.template.js > build/env.js
envsubst < public/env.template.js > public/env.js

cat public/env.template.js
