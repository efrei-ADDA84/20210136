FROM node:alpine3.19
WORKDIR /weather-docker

COPY package*.json ./
RUN npm install -g npm@10.5.2 && npm cache clean --force


RUN npm install express@4.19.2

RUN apk update && apk upgrade && apk add --no-cache openssl=3.1.4-r6
RUN apk add --no-cache tar= 6.2.1

COPY . .

ARG Apikey
ENV API_KEY=$Apikey

EXPOSE 8080
CMD ["node", "tp2.js"]
