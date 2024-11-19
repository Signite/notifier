FROM node:alpine AS builder

ARG BASE_URL="/"
ENV BASE_URL=${BASE_URL}

WORKDIR /notifier/site
COPY ./client/package*.json .
RUN npm i
COPY  ./client .
RUN npm run prebuild
RUN npm run build

WORKDIR /notifier/server
COPY ./server/package*.json .
RUN npm i
COPY ./server .
RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENT=${NODE_ENV}

RUN mkdir -p /notifier/data

WORKDIR /notifier/app

COPY ./server/package*.json .

RUN npm i

COPY --from=builder /notifier/site/public ./public
COPY --from=builder /notifier/server/build ./src

CMD ["node","."]