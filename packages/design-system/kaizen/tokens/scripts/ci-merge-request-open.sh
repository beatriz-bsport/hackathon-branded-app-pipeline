#!/bin/sh

if [ -z "$GITLAB_USER_EMAIL" ] || [ -z "$GITLAB_USER_NAME" ] || [ -z "$CI_GITLAB_MONOREPO_ACCESS_TOKEN" ] || [ -z "$CI_SERVER_HOST" ] || [ -z "$CI_PROJECT_PATH" ] || [ -z "$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME" ]; then
  echo "Error: One or more required GitLab environment variables are missing."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git checkout main
pnpm run tokens:import
git checkout "$CURRENT_BRANCH"

if [ -n "$(git status --porcelain)" ]; then
  echo "Changes detected, committing and pushing..."

  git config --global user.email "${GITLAB_USER_EMAIL}"
  git config --global user.name "${GITLAB_USER_NAME}"
  git add .
  git commit -m "ci: updated tokens & styles during merge request"

  git remote remove origin
  git remote add gitlab_origin "https://oauth2:${CI_GITLAB_MONOREPO_ACCESS_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"

  echo "Remote URL set to: https://oauth2:*****@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"

  if ! git pull --rebase gitlab_origin "${CI_MERGE_REQUEST_SOURCE_BRANCH_NAME}"; then
      echo "Error pulling from branch ${CI_MERGE_REQUEST_SOURCE_BRANCH_NAME}. Please resolve conflicts."
      exit 1
  fi

  echo "Pushing changes to gitlab_origin ${CI_MERGE_REQUEST_SOURCE_BRANCH_NAME}"
  if git push -u --force gitlab_origin HEAD:"${CI_MERGE_REQUEST_SOURCE_BRANCH_NAME}" -o ci.skip; then
      echo "Push successful!"
  else
      echo "Error pushing to branch ${CI_MERGE_REQUEST_SOURCE_BRANCH_NAME}"
      exit 1
  fi
else
  echo "No changes detected, nothing to commit."
fi
