# STAGE 1 : Installing node_modules and creating pnpm store

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-ichizen:v1.0.1 AS deps

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

# STAGE 2 : Keep final Image creation as clean as possible

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-ichizen:v1.0.1 AS final

RUN mkdir -p /storage

WORKDIR /storage

# We don't need to keep node_modules as they are hardlinked to pnpm-store
# All packages informations are stored inside the pnpm-store
COPY --from=deps /storage/pnpm-store ./pnpm-store
