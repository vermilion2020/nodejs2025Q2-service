FROM node:22-alpine

WORKDIR /library

COPY package*.json ./

COPY . .

COPY .env.example .env

RUN npm cache clean --force
RUN npm install 

RUN npm run build

CMD [ "npm", "run", "docker:prepare" ]