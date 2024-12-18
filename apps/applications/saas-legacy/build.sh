#!/bin/sh

if [ $STAGING -eq 1 ]
then
  mv /app/.env.staging /app/.env.production
fi

pnpm run build
cp -r /app/build/* /build/
