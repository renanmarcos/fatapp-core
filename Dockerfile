FROM node:12.7.0-alpine

WORKDIR /user/fatapp-core

COPY package.json .
RUN npm i --quiet

COPY . .