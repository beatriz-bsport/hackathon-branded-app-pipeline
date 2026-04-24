#!/bin/bash

set -euo pipefail

# Assume cross-account role for EKS access
CREDS=$(aws sts assume-role \
  --role-arn "${GITLAB_RUNNER_ASSUME_DEV_ROLE_ARN}" \
  --role-session-name "ichizen-gitlab-ci-preview-${CI_MERGE_REQUEST_IID}")

export AWS_ACCESS_KEY_ID=$(echo "$CREDS" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$CREDS" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$CREDS" | jq -r '.Credentials.SessionToken')

aws eks update-kubeconfig \
  --name "${DEV_EKS_CLUSTER_NAME}" \
  --region "${AWS_REGION}"

kubectl delete environment preview-$CI_MERGE_REQUEST_IID --ignore-not-found=true