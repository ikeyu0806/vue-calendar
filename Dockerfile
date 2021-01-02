FROM node:12.5.0-alpine

RUN yarn install

WORKDIR /calendar

ENV HOST 0.0.0.0

EXPOSE 3000
