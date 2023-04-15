FROM node:16.20-alpine

WORKDIR /app

COPY tsconfig*.json ./
COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

CMD [ "npm", "start" ]