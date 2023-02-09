FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-14 AS raw

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-14
WORKDIR /app

COPY --from=raw /app/node_modules /app/node_modules
