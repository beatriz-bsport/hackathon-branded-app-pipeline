FROM node:8-alpine


ADD ./package.json /app/
ADD ./yarn.lock /app/

WORKDIR /app

RUN yarn install

ADD . .
