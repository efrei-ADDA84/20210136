# RAPPORT TP2 - Devops


# Objectifs

- Configurer un workflow Github Action
- Transformer un wrapper en API
- Publier automatiquement a chaque push sur Docker Hub
- Mettre à disposition son image (format API) sur DockerHub
- Mettre à disposition son code dans un repository Github

# Livrables

- URL repository Github publique (avec Dockerfile, l'API et la configuration Github Action)
- URL registry DockerHub publique
- Rapport qui présente, étape par étape, les choix techniques et les difficultées rencontrées


# Notation

- Code disponible sur Github
- Github action qui build et push l'image à chaque nouveau commit
- Docker image disponible sur DockerHub
- API qui renvoie la météo en utilisant la commande suivante en utilisant votre image :
  ``docker run --network host --env API_KEY=**** maregistry/efrei-devops-tp2:1.0.0``
  puis dans un autre terminal
  ``curl "http://localhost:8081/?lat=5.902785&lon=102.754175"``
  
# Bonus

- Add hadolint to Github workflow before build+push and failed on errors
- Aucune données sensibles stockées dans l'image ou le code source (i.e: openweather API key, Docker hub credentials)


# Introduction

Dans le cadre du cours de DevOps, le TP2 vise à mettre en lumière les fonctionnalités avancées de l'Intégration Continue et du Déploiement Continu (CI/CD) à travers l'utilisation des GitHub Actions. 
L'objectif de ce TP est de configurer un workflow Github Action, de transformer un wrapper en une API qui interagit avec le service OpenWeather pour obtenir des informations météorologiques via des coordonnées géographiques fournies. 
Ce projet permettra de configurer un workflow GitHub Action qui automatise la construction et le déploiement d'une image Docker.

## Fichiers

Nous maintiendrons la même architecture que dans le TP1, en ajoutant le fichier de configuration pour l'action GitHub dans  `.github/workflows` 

- Secret du dépôt GitHub

Ici, nous avons 2 secrets de dépôt permettant de contenir des informations sensibles correspondant aux identifiants DockerHub.

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/015c1fae-e6ea-4083-9262-1bae839fd81c)

Pour la clé API_KEY, nous la mettrons dans un fichier .env.

# Code

Le code de l'API météo développé en utilisant Node.js :

```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

const API_KEY = process.env.API_KEY;


````

On commence par importer les modules nécessaires, notamment Express pour la gestion des routes et Axios pour effectuer des requêtes HTTP. Il configure également le port sur lequel le serveur écoutera et récupère la clé d'API à partir des variables d'environnement.

```javascript
app.get('/', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const weatherData = response.data;
        const cityName = weatherData.name;
        const weatherDescription = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;
        const weatherOutput = `${cityName}: ${weatherDescription}. Temperature: ${temperature}°C.`;

        res.send(weatherOutput);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});
````
Ensuite, la route principale / est définie pour gérer les requêtes de données météorologiques. Elle vérifie d'abord si les coordonnées géographiques et la clé d'API sont fournies. Ensuite, elle utilise Axios pour interroger l'API OpenWeather avec les coordonnées fournies et renvoie les données météorologiques avec la ville, la description et la Température.

````javascript
app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
  });
````
Enfin, le serveur est démarré et écoute sur le port défini, avec un message de confirmation affiché dans la console.

# Dockerfile
Le Dockerfile utilisé pour créer l'image Docker de l'API météo  :

```Docker

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

EXPOSE 8080
CMD ["node", "Tp2.js"]
````

Ce Dockerfile utilise une image Node.js Alpine comme base. Il copie d'abord le fichier package.json pour installer les dépendances Node.js nécessaires, puis installe Express. 
Ensuite, il met en place les dépendances nécessaires pour garantir le bon fonctionnement de l'application dans l'environnement Docker. Enfin, il expose le port 8080 sur lequel l'API écoute et définit la commande pour démarrer le serveur.

# Workflow

Le workflow GitHub utilisé pour la construction et la publication de l'image Docker :

````yaml
Copy code
name: Construction et publication Docker

on:
  push:
    branches:
      - Tp2

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Vérifier le dépôt
        uses: actions/checkout@v3

      - name: Installer hadolint
        run: |
          wget -O hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64
          chmod +x hadolint
          sudo mv hadolint /usr/local/bin/

      - name: Vérifier le Dockerfile
        run: |
          hadolint Dockerfile

      - name: Connexion à Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Construire et pousser l'image Docker
        run: |
          docker build -t fannyc13/tp2-image:weather-image .
          docker push fannyc13/tp2-image:weather-image

````
Voici un aperçu du Run d'un Workflow :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/07423ac2-c845-4a48-9466-117fe515e1be)

Ce workflow GitHub est déclenché à chaque push sur la branche Tp2. Il vérifie d'abord le dépôt, puis utilise Hadolint pour vérifier la syntaxe du Dockerfile. Ensuite, il se connecte à Docker Hub en utilisant les identifiants fournis dans les secrets du dépôt. Enfin, il construit l'image Docker en utilisant le Dockerfile et pousse l'image construite sur DockerHub.

# Bonus

En utilisant Trivy, on remarque qu'aucune vulnérabilité n'est présente :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/74687499-5b9d-4a95-a1a5-e6ad70561a9c)

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/c92c8f96-fccb-45de-9085-7b2fb73310fa)

Finalement on peut run l'image :

````cmd
docker run -p 8080:8080 --env API_KEY=*** fannyc13/tp2-image:weather-image
````

Et lancer la commande :
````
curl "http://localhost:8080/?lat=5.902785&lon=102.754175"
````
````
StatusCode        : 200                                                                                                                                             
StatusDescription : OK                                                                                                                                              
Content           : Jertih: overcast clouds. Temperature: 301.52°C.                                                                                                 
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 48
                    Content-Type: text/html; charset=utf-8
                    Date: Tue, 16 Apr 2024 18:50:27 GMT
                    ETag: W/"30-JqE6Ae78Lcsl2hvHgF8voNEWslo...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 48], [Content-Type, text/html; charset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 48
````
Sur une page web on obtient :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/e35b7395-1227-4a29-8ea7-8abd5407724d)


# Conclusion 

En conclusion, ce TP2 en DevOps a démontré de manière efficace l'application des principes d'intégration continue et de déploiement continu (CI/CD).  
Tout au long du processus, des difficultés ont été rencontrées. En particulier, la gestion des vulnérabilités a posé des défis, nécessitant la recherche et la sélection des bonnes versions de dépendances pour minimiser les risques. De plus, sécuriser l'accès à l'API KEY a été crucial, exigeant des mesures spécifiques pour protéger les informations sensibles et empêcher les accès non autorisés.
Ce TP, a permis de mettre l'accent sur des compétences essentielles en DevOps telles que l'automatisation et l'accessibilité, ce travail a permis d'automatiser le développement et déploiement d'une image d'une API Dockerisée.




