#!/bin/sh

# Retrieve the merge request title from the environment variable
MR_TITLE="$1"
echo "⏳ Start checking the Merge request title follow the Commitizen pattern ..."
echo "Detected title : $MR_TITLE"

# Regular expressions for individual parts of the Commitizen pattern
TYPE_PATTERN='^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)$'
SCOPE_PATTERN='^[a-zA-Z0-9_/\-]+$'
SUBJECT_PATTERN='^[a-zA-Z0-9 _()\[\]|/,?;.:&\\-]{1,80}$'

# Function to check the type
check_type() {
  TYPE=$(echo "$MR_TITLE" | awk -F'(' '{print $1}' | awk -F':' '{print $1}' | tr -d ' ')
  echo "*"
  echo "Detected type : $TYPE"
  if ! echo "$TYPE" | grep -qE "$TYPE_PATTERN"; then
    echo "❗ Error: Type '$TYPE' does not match the expected pattern."
    echo "💡 Please use one of the following types : build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test."
    return 1
  fi
  echo "✅ Type is valid"
  return 0
}

# Function to check the scope
check_scope() {
  SCOPE=$(echo "$MR_TITLE" | awk -F'(' '{print $2}' | awk -F')' '{print $1}')
  echo "*"
  echo "Detected scope : $SCOPE"
  if [ -n "$SCOPE" ] && ! echo "$SCOPE" | grep -qE "$SCOPE_PATTERN"; then
    echo "❗ Error: Scope '$SCOPE' does not match the expected pattern."
    echo "💡 Please ensure it contains only alphanumeric characters and hyphens."
    return 1
  fi
  echo "✅ Scope is valid"
  return 0
}

# Function to check the subject
check_subject() {
  SUBJECT=$(echo "$MR_TITLE" | awk -F': ' '{print $2}')
  echo "*"
  echo "Detected subject : $SUBJECT"
  if ! echo "$SUBJECT" | grep -qE "$SUBJECT_PATTERN"; then
    echo "❗ Error: Subject '$SUBJECT' does not match the expected pattern."
    echo "💡 Please ensure it contains between 1 and 80 characters in length, and only "
    echo "alphanumeric characters, spaces, and the following characters : , or ; or . or ? or : or / or \\ or () or [] or - or _"
    return 1
  fi
  echo "✅ Subject is valid"
  return 0
}

# Perform all checks and log information
check_type
TYPE_CHECK=$?

check_scope
SCOPE_CHECK=$?

check_subject
SUBJECT_CHECK=$?

echo "*"
# Exit with 0 only if all checks are right
if [ $TYPE_CHECK -eq 0 ] && [ $SCOPE_CHECK -eq 0 ] && [ $SUBJECT_CHECK -eq 0 ]; then
  echo "✅ Merge request title follows Commitizen pattern."
  exit 0
else
  echo "❌ Merge request title does not follow Commitizen pattern: 'type(scope): subject'."
  echo "💡 Please rename your Merge request title before triggering the pipeline again."
  exit 1
fi
