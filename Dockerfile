FROM node:alpine3.19
WORKDIR /weather-docker
COPY .env .env
COPY package*.json ./
COPY . .
RUN npm install
RUN apk add --no-cache tar
RUN apk update && apk upgrade
RUN apk add openssl
EXPOSE 8080
CMD ["node", "tp2.js"]
