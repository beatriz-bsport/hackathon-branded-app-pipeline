FROM bsport-commons as dependencies

FROM node

COPY --from=dependencies /app/ /bsport-commons
WORKDIR /bsport-commons
RUN yarn link


ADD ./package.json /app/
ADD ./yarn.lock /app/

WORKDIR /app

RUN yarn link bsport-commons
RUN yarn install

ADD . .
