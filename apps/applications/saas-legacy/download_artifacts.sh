#!/bin/bash

URL=https://gitlab.com/api/v4/projects/bsport%2Fbsport-saas/jobs/artifacts/$HEAD/download?job=build

curl --output artifacts.zip --header "PRIVATE-TOKEN: $GITLAB_PRIVATE_TOKEN" $URL

unzip artifacts.zip -d build
