#!/bin/bash

set -ex

git config --global user.email "contact@bsport.io"
git config --global user.name "bsport-bot"

set +x
[ -z "$GIT_USERNAME" ] && echo "⚠️⚠️⚠️ Missing env variable GIT_USERNAME ⚠️⚠️⚠️" && exit 1
[ -z "$GIT_PASSWORD" ] && echo "⚠️⚠️⚠️ Missing env variable GIT_PASSWORD ⚠️⚠️⚠️" && exit 1

echo "==========================="
echo "Cloning locally bsport-config repository"
git clone "https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/bsport/bsport-config"
set -x
