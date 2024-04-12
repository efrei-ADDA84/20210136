FROM node:alpine3.19
WORKDIR /weather-docker

COPY package*.json ./

RUN npm install -g npm@10.5.2 && \
    npm cache clean --force && \
    npm install express@4.19.2 && \
    npm install prom-client@15.1.1 && \
    apk update && \
    apk upgrade && \
    apk add --no-cache openssl=3.1.4-r6 && \
    apk add --no-cache tar=1.35-r2
    
COPY . .

EXPOSE 8081
CMD ["node", "Tp3.js"]
