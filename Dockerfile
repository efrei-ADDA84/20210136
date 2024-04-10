FROM node:alpine3.19
WORKDIR /weather-docker
COPY . .
RUN npm install
RUN apk update && apk upgrade
RUN apk add openssl
EXPOSE 8080
CMD ["node", "server.js"]
