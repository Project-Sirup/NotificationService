FROM node:latest

WORKDIR /sirup/service

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install 

RUN npm run build

CMD ["sh","-c","npm run start"]