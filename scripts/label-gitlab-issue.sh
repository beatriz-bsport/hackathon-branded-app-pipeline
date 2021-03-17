#!/bin/sh

set -ex

TOKEN="$CI_TOKEN_PRODUCT_MANAGEMENT_ACCESS_TOKEN"
PROJECT="$CI_PROJECT_ID"
LABEL="deployed::$ENVIRONMENT"

git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@gitlab.com/bsport/bsport-saas.git
git config --global user.email "contact@bsport.io"
git config --global user.name "bsport-bot"
git fetch
exists=`git show-ref refs/heads/${CI_COMMIT_REF_NAME}` && if [ -n "$exists" ]; then git branch -D ${CI_COMMIT_REF_NAME}; fi

git checkout -b $CI_COMMIT_REF_NAME

echo "Comparing commits between ${SOURCE_BRANCH} (source) and ${DEST_BRANCH} (dest)"
echo "----------------------------------------------------------------------------"

if [ $DEST_BRANCH ];
then
	COMMITS=$(git log --since=2.weeks -R $SOURCE_BRANCH --not origin/$DEST_BRANCH)
else
	COMMITS=$(git log --since=2.weeks -R $SOURCE_BRANCH)
fi

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
