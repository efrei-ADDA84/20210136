FROM node:alpine3.19
WORKDIR /weather-docker

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm install -g npm@10.5.2 && npm cache clean --force
RUN npm install express@4.19.2

RUN apk update && apk upgrade && apk add --no-cache openssl=3.1.4-r6
RUN apk add --no-cache tar=1.35-r2
COPY .env .
COPY . .

ENV API_KEY=${Apikey}

USER appuser
EXPOSE 8080
CMD ["node", "tp2.js"]
