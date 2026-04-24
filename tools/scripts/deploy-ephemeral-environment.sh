#!/bin/bash

set -euo pipefail

# Assume cross-account role for EKS access
CREDS=$(aws sts assume-role \
  --role-arn "${GITLAB_RUNNER_ASSUME_DEV_ROLE_ARN}" \
  --role-session-name "ichizen-gitlab-ci-preview-${CI_MERGE_REQUEST_IID}-$GITLAB_USER_LOGIN")

export AWS_ACCESS_KEY_ID=$(echo "$CREDS" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$CREDS" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$CREDS" | jq -r '.Credentials.SessionToken')

aws eks update-kubeconfig \
  --name "${DEV_EKS_CLUSTER_NAME}" \
  --region "${AWS_REGION}"

# Create the ephemeral environment for this merge request
kubectl apply -f - <<EOF
apiVersion: apps.sre.bsport.io/v1alpha1
kind: Environment
metadata:
  name: preview-$CI_MERGE_REQUEST_IID
  labels:
    bsport.io/owner: ${GITLAB_USER_LOGIN}
spec:
  frontends:
    backoffice:
      version: $CI_COMMIT_SHORT_SHA
  type: frontend-only
EOF

# Wait for the environment to be created and become ready
TIMEOUT=900
INTERVAL=10
START_TIME=$(date +%s)

while true; do
  STATUS=$(kubectl get environment "preview-$CI_MERGE_REQUEST_IID" -o jsonpath='{.status.state}' 2>/dev/null || echo "Pending")
  if [ "$STATUS" == "Ready" ]; then
    echo "Ephemeral environment is ready."
    break
  fi
  echo "Waiting for the ephemeral environment to be ready, current status: $STATUS. Retrying in $INTERVAL seconds..."
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  if [ $ELAPSED_TIME -ge $TIMEOUT ]; then
    echo "Timed out waiting for the ephemeral environment to be ready."
    exit 1
  fi
  sleep $INTERVAL
done