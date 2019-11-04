FROM node:lts-slim

RUN npm i -g ts-node typeorm typescript mocha chai tsconfig-paths

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /user/fatapp-core

ENV TIMEZONE America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TIMEZONE /etc/localtime \ 
    && echo $TIMEZONE > /etc/timezone

COPY package*.json ./
RUN npm ci

COPY . ./

CMD dockerize -wait tcp://mysql:${TYPEORM_PORT} -timeout 60s npm run dev