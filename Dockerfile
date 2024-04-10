FROM node:alpine3.19
WORKDIR /weather-docker
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node", "server.js"]
