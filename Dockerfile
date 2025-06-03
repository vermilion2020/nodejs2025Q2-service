FROM node:22-alpine

WORKDIR /library

COPY package*.json ./

COPY . .

CMD [ "npm", "run", "docker:prepare" ]