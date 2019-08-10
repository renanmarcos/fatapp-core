FROM node:12.8-buster

WORKDIR /user/fatapp-core

COPY . .

RUN npm i --quiet