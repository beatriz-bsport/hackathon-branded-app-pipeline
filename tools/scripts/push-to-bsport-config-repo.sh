#!/bin/bash

set -ex

echo "==========================="
echo "Moving inside bsport-config directory"
cd ./bsport-config

echo "==========================="
echo "Pushing new version files for frontend to GitLab repository bsport-config"
git push origin master --force-with-lease

cd -