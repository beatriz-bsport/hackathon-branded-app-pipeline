#!/bin/sh

set -e

TOKEN="$CI_TOKEN_PRODUCT_MANAGEMENT_ACCESS_TOKEN"
PROJECT="$CI_PROJECT_ID"
LABEL="deployed::$ENVIRONMENT"

echo "Comparing commits between ${SOURCE_BRANCH} (source) and ${DEST_BRANCH} (dest)"
echo "----------------------------------------------------------------------------"

COMMITS=$(git log --since=2.weeks --R $SOURCE_BRANCH -not $DEST_BRANCH)
MATCH=$(echo $COMMITS | grep -Ec "\[ISSUE: #[[:digit:]]+]")

if [ $MATCH -gt 0 ]
then
  issues=$(echo $COMMITS | grep -Eo "\[ISSUE: #[[:digit:]]+]" | uniq)
  echo "Looping through the issues \n${issues} and tagging them as ${LABEL}"
  echo "$issues" | while read issue_format ; do
    issue_tag=$(echo $issue_format | grep -Eo "#[[:digit:]]+" | cat)
    issue_number=$(echo $issue_tag | grep -Eo "[[:digit:]]+" | cat)
    echo "Add $LABEL To issue #$issue_number"
    curl --request PUT --header "PRIVATE-TOKEN: $TOKEN" "https://gitlab.com/api/v4/projects/$PROJECT/issues/$issue_number?add_labels=$LABEL"
  done
fi
