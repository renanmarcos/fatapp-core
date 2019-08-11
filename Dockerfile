FROM node:12.8.0-buster

WORKDIR /user/fatapp-core

COPY . .

RUN npm i --quiet