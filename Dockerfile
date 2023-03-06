FROM node:lts-alpine AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

FROM denoland/deno:alpine as prod
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN apk add npm
RUN npm install
COPY . /usr/src/app
RUN npm run build
CMD [ "npm", "run", "preview" ]

FROM base AS dev
ENV HOST 0.0.0.0
CMD /bin/ash -c 'npm install; npm run dev -- --host'