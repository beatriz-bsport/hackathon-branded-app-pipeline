FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .
