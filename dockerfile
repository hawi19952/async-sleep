FROM node:16.2.0-alpine

WORKDIR /app

COPY * ./

RUN npm ci

RUN npm run build

CMD [ "npm", "start" ]