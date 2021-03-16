#!/bin/sh

set -e

token="$CI_TOKEN_PRODUCT_MANAGEMENT_ACCESS_TOKEN"
project="$CI_PROJECT_ID"
label="deployed:$ENVIRONMENT"

commits=$(git log --since=2.weeks)
match=$(echo $commits | grep -Ec "\[ISSUE: #[[:digit:]]+]")

if [ $match -gt 0 ]
then
  issues=$(echo $commits | grep -Eo "\[ISSUE: #[[:digit:]]+]" | uniq)
  echo "$issues" | while read issue_format ; do
    issue_tag=$(echo $issue_format | grep -Eo "#[[:digit:]]+" | cat)
    issue_number=$(echo $issue_tag | grep -Eo "[[:digit:]]+" | cat)
    echo "Add $label to issue #$issue_number"
    curl --request PUT --header "PRIVATE-TOKEN: $token" "https://gitlab.com/api/v4/projects/$project/issues/$issue_number?add_labels=$label"
  done
fi