#!/bin/sh


# scp -r dist bsport.io:/var/www/saas/
# scp -r build sofian@bsport.io:/var/www/saas/
yarn build
cp -r /app/build/* /build/
