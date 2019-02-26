FROM registry.gitlab.com/bsport/@bsport/common-js as dependencies

FROM node:8-alpine

COPY --from=dependencies /app/ /@bsport/common
WORKDIR /@bsport/common
RUN yarn link


ADD ./package.json /app/
ADD ./yarn.lock /app/

WORKDIR /app

RUN yarn link @bsport/common
RUN yarn install

ADD . .
