FROM node:lts-alpine AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

FROM denoland/deno:alpine as prod
RUN apk add npm
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
CMD /bin/ash -c 'npm run build; npm run preview;'

FROM base AS dev
ENV HOST 0.0.0.0
CMD /bin/ash -c 'npm install; npm run dev -- --host'