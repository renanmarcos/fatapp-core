FROM node:12.8.0-buster-slim

WORKDIR /user/fatapp-core

COPY package*.json ./

RUN npm ci
RUN ln -s node_modules ./node_modules

COPY . .