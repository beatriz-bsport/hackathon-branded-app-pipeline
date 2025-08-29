# Docs: https://www.notion.so/bright-shovel-41b/How-to-publish-an-internal-package-to-other-repositories-1c2137e4c640808d97daded65c80c35e

#/usr/bin/env bash
set -eE

# Create a temp npm userconfig with auth settings (cleaned up on exit)
TMP_NPMRC="$(mktemp)"
trap 'rm -f "$TMP_NPMRC"' EXIT
{
  echo "@bsport:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/"
  echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}"
  echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:always-auth=true"
} > "$TMP_NPMRC"
 
# Publish the package to the npm registry with npm
npm publish --userconfig "$TMP_NPMRC"
