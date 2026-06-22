#!/bin/bash

set -ex

[ -z "$APPLICATION" ] && echo "⚠️⚠️⚠️ Missing env variable APPLICATION ⚠️⚠️⚠️" && exit 1
[ -z "$APP_VERSION" ] && echo "⚠️⚠️⚠️ Missing env variable APP_VERSION ⚠️⚠️⚠️" && exit 1
[ -z "$VALUE_FILE_PATH" ] && echo "⚠️⚠️⚠️ Missing env variable VALUE_FILE_PATH ⚠️⚠️⚠️" && exit 1
[ -z "$YAML_PATH" ] && echo "⚠️⚠️⚠️ Missing env variable YAML_PATH ⚠️⚠️⚠️" && exit 1

echo "==========================="
echo "Moving inside bsport-config directory"
cd ./bsport-config

echo "==========================="
echo "Writing the new ${APPLICATION} app version ${APP_VERSION}"

echo "~> Writing the version in $VALUE_FILE_PATH"
yq e -i "$YAML_PATH = \"${APP_VERSION}\"" "$VALUE_FILE_PATH"

echo "~> Committing the new version files to GitLab"
git add "$VALUE_FILE_PATH"

if [[ -n "$(git status -s "$VALUE_FILE_PATH")" ]]; then
  git commit -m "ci($APPLICATION): Update $APPLICATION on $ENV to version $APP_VERSION"
fi

cd -

