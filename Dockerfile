# STAGE 1 : Creating OS deps
# [TEMP] WAITING FOR monorepo builder TO BE CREATED AND PUSHED TO ECR.
# The following section replicates this MR : 
# https://gitlab.com/bsport/bsport-tools/-/merge_requests/7/diffs

FROM node:22-alpine AS gitlab-build-monorepo

# Installing dependencies
RUN apk add --no-cache \
    curl git aws-cli openssh \
    python3 py3-pip \
    pango-dev cairo-dev build-base jpeg-dev giflib-dev librsvg-dev \
    make g++

# Add python for specific usages (node-gyp for instance)
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN npm add --global @sentry/cli

# =============================================================================

# STAGE 2 : Installing node_modules and creating pnpm store

FROM gitlab-build-monorepo AS deps

# Creates a directory /storage in the container's filesystem.
# The -p flag ensures that no error occurs if the directory already exists
RUN mkdir -p /storage

# Sets /storage as the working directory for subsequent instructions in the Dockerfile.
# All relative paths in subsequent commands will be resolved relative to /storage
WORKDIR /storage

# Creates a src directory to temporarily store the source code
RUN mkdir -p ./src

# Copy pnpm files
COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml ./src/

# Install pnpm
RUN cd src/ && export PNPM_VERSION=$(grep pnpm_version .npmrc | cut -d '=' -f 2) && \
    npm install -g pnpm@$PNPM_VERSION

# Define pnpm store path to a local dir
RUN mkdir -p ./pnpm-store
RUN pnpm config set store-dir /storage/pnpm-store

# Install node_modules in the src directory from the "pnpm-lock.yaml" file
RUN cd src/ && pnpm fetch

# =============================================================================

# STAGE 3 : Keep final Image creation as clean as possible

FROM gitlab-build-monorepo AS final

RUN mkdir -p /storage

WORKDIR /storage

# We don't need to keep node_modules as they are hardlinked to pnpm-store
# All packages informations are stored inside the pnpm-store
COPY --from=deps /storage/pnpm-store ./pnpm-store