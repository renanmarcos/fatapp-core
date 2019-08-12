FROM node:12.8.0-buster-slim

WORKDIR /user/fatapp-core

COPY package.json /user/fatapp-core
COPY .env /user/fatapp-core

RUN npm i --quiet