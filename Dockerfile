FROM node:alpine3.19
WORKDIR /weather-docker
COPY . .
RUN npm install -g npm@10.5.2 && npm cache clean --force
RUN apk add --no-cache tar
RUN apk update && apk upgrade
RUN apk add openssl
EXPOSE 8080
CMD ["node", "tp2.js"]

