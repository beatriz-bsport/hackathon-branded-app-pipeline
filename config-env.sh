#!/bin/bash
. .env
export $(cut -d= -f1 .env)
envsubst < public/env.template.js > build/env.js
envsubst < public/env.template.js > public/env.js

cat public/env.template.js
