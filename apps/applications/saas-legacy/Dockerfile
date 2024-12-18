FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-18 AS raw

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY pnpm run.lock .
RUN pnpm run install --frozen-lockfile

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-18
WORKDIR /app

COPY --from=raw /app/node_modules /app/node_modules
