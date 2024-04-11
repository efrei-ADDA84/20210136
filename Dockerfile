FROM node:alpine3.19
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /weather-docker
COPY package*.json ./
RUN npm install -g npm@10.5.2 && npm cache clean --force
RUN apk add --no-cache tar
RUN apk add --no-cache tar --version "6.2.1"
RUN apk update && apk upgrade
RUN apk add openssl
COPY . .
EXPOSE 8080
CMD ["node", "tp2.js"]