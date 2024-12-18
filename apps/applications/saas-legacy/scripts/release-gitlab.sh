#!/bin/sh

CI_PROJECT_ID=$2

# NOT WORKING BECAUSE SOME NEWLINES ARE INTERPETED
#
# CHANGELOG=`sed -e '/^## / { x; G; :a' -e 'n; /^## /! ba' -e 'n; q; }; h; d' CHANGELOG.md  | sed '$d' | sed '$d' | sed 's/\\n/\\\\n/g' | awk 1 ORS='\\n'`
# echo CHANGELOG: $CHANGELOG
echo VERSION: $1


curl  --trace-ascii - --header 'Content-Type: application/json' --header "JOB-TOKEN: $CI_JOB_TOKEN"  --data '{ "name": "Release '"$1"'", "tag_name": "'"$1"'", "ref": "'"$1"'" }' https://gitlab.com/api/v4/projects/${CI_PROJECT_ID}/releases  | xargs -0 echo
