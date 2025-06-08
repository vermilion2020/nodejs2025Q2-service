FROM node:22-alpine3.22

WORKDIR /library

COPY package*.json ./

COPY . .

CMD [ "npm", "run", "docker:prepare" ]