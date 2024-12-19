ARG GIT_USERNAME
ARG GIT_PASSWORD
ARG CI_COMMIT_REF_NAME 
ARG ENVIRONMENT 
ARG FEATURE_BRANCH_IDENTIFIER

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-18 AS raw

ARG GIT_USERNAME
ARG GIT_PASSWORD
ARG CI_COMMIT_REF_NAME 
ARG ENVIRONMENT 
ARG FEATURE_BRANCH_IDENTIFIER

RUN echo $ENVIRONMENT 
RUN echo $FEATURE_BRANCH_IDENTIFIER
RUN echo $CI_COMMIT_REF_NAME 
RUN echo $GIT_PASSWORD
RUN echo $GIT_USERNAME

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY link_bsport_saas.sh .

ARG TODAY
RUN echo $TODAY
RUN ./link_bsport_saas.sh $FEATURE_BRANCH_IDENTIFIER
RUN yarn install --frozen-lockfile

FROM 672633452901.dkr.ecr.eu-west-3.amazonaws.com/bsport-infra/gitlab-build-frontend:node-18
WORKDIR /app

COPY --from=raw /app/node_modules /app/node_modules
COPY --from=raw /bsport-saas /bsport-saas
