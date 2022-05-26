ARG GIT_USERNAME
ARG GIT_PASSWORD
ARG CI_COMMIT_REF_NAME 
ARG ENVIRONMENT 

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-12 AS raw

ARG GIT_USERNAME
ARG GIT_PASSWORD
ARG CI_COMMIT_REF_NAME 
ARG ENVIRONMENT 

RUN echo $ENVIRONMENT 
RUN echo $CI_COMMIT_REF_NAME 
RUN echo $GIT_PASSWORD
RUN echo $GIT_USERNAME

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY link_bsport_saas.sh .

RUN ./link_bsport_saas.sh .
RUN yarn install --frozen-lockfile

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend 
WORKDIR /app

COPY --from=raw /app/node_modules /app/node_modules
COPY --from=raw /bsport-saas /bsport-saas
