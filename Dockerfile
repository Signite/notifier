FROM node:alpine AS builder

ARG BASE_URL="/"
ENV BASE_URL=${BASE_URL}

ARG PROXY_HTTP=""
ENV PROXY_HTTP=${PROXY_HTTP}
ARG PROXY_HTTPS=""
ENV PROXY_HTTPS=${PROXY_HTTPS}

RUN npm config set proxy ${PROXY_HTTP}
RUN npm config set https-proxy ${PROXY_HTTPS}

WORKDIR /notifier/site
COPY ./client/package*.json ./
RUN npm i
COPY  ./client .
RUN npm run prebuild
RUN npm run build

WORKDIR /notifier/server
COPY ./server/package*.json ./
RUN npm i
COPY ./server .
RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENT=${NODE_ENV}

ARG PROXY_HTTP=""
ENV PROXY_HTTP=${PROXY_HTTP}
ARG PROXY_HTTPS=""
ENV PROXY_HTTPS=${PROXY_HTTPS}

RUN npm config set proxy ${PROXY_HTTP}
RUN npm config set https-proxy ${PROXY_HTTPS}

RUN mkdir -p /notifier/data

WORKDIR /notifier/app

COPY ./server/package*.json ./

RUN npm i

COPY --from=builder /notifier/site/public ./public
COPY --from=builder /notifier/server/build ./src

CMD ["node","."]