# Rapport TP3 - DEVOPS

# Objectifs

Les objectifs de ce travail pratique étaient les suivants :

- Mettre à disposition son code dans un repository Github.
- Mettre à disposition son image (format API) sur Azure Container Registry (ACR) en utilisant Github Actions.
- Déployer sur Azure Container Instance (ACI) en utilisant Github Actions.

## Github organization available secrets

- **AZURE_CREDENTIALS :** Service account pour s'authentifier avec l'API Azure.
- **REGISTRY_LOGIN_SERVER :** Lien de la registry (efreidevops.azurecr.io).
- **REGISTRY_USERNAME :** Username de la registry.
- **REGISTRY_PASSWORD :** Password pour la registry.
- **RESOURCE_GROUP :** Resource group Azure (ADDA84-CTP).

## Contraintes

- **Location :** France central.
- **DNS-name-label :** devops-<identifiant-efrei>.
- **Utiliser l'organisation Github et ses secrets.**
- **Azure Container Registry :** efreidevops.azurecr.io.
- **ACI name :** Identifiant EFREI (example: 11002167 ).
- **ACR repository name :** Identifiant EFREI (example: efreidevops.azurecr.io/11002167:v1 ).

## Livrables

- URL repository Github (avec Dockerfile, l'API et la configuration Github Action).
- Rapport qui présente, étape par étape, les choix techniques et les difficultés rencontrées, ainsi que l'intérêt de l'utilisation d'une Github Action pour déployer plutôt que via l'interface utilisateur ou la CLI.

## Notation

- Code disponible sur Github.
- Github action qui build et push l'image à chaque nouveau commit sur ACR.
- Container déployé sur Azure Container Instance.
- API qui renvoie la météo en utilisant la commande suivante :
  ```bash
  curl "http://devops-<identifiant-efrei>.francecentral.azurecontainer.io/?lat=5.902785&lon=102.754175"
  ````

## Bonus
Utilisation des bibliothèques Prometheus (https://prometheus.io/docs/instrumenting/clientlibs/) pour exposer un endpoint HTTP /metrics. Utilisation d'un compteur pour représenter le nombre de requêtes traitées.


# Introduction
Dans la continuité du TP2, le TP3 poursuit l'exploration des pratiques d'intégration continue et de déploiement continu (CI/CD) en utilisant les outils et services de GitHub, Docker, et Azure. 
L'objectif principal était de mettre en place un pipeline d'intégration et de déploiement continu (CI/CD) utilisant GitHub Actions pour construire, pousser et déployer une image Docker d'une API météo sur Azure Container Registry (ACR) et Azure Container Instance (ACI).

# Code Source

Dans cette partie, on importe les modules nécessaires (Express.js pour la gestion des routes, Axios pour les requêtes HTTP) et configurons l'environnement en récupérant la clé d'API à partir des variables d'environnement.

````Javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

const API_KEY = process.env.API_KEY;
````

Cette partie définit la route principale de l'API pour récupérer les données météo en fonction des coordonnées géographiques fournies.

````Javascript
app.get('/', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        res.send(weatherOutput);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});
````
Cette partie expose une autre route pour les métriques Prometheus, qui peuvent être utilisées pour surveiller les performances de l'API.

````Javascript
// Route pour exposer les métriques Prometheus
app.get('/metrics', async (req, res) => {
    try {
        // Génération des métriques Prometheus
        const metrics = await prometheus.register.metrics();
        res.set('Content-Type', prometheus.register.contentType);
        res.end(metrics.toString());
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).send('Error fetching metrics');
    }
});

app.listen(8081, () => {
    console.log(`Server listening on port 8081`);
});

````


# Dockerfile

Le Dockerfile définit l'environnement nécessaire pour exécuter l'API météo 
Ce Dockerfile installe les dépendances nécessaires, expose le port 8081 utilisé par l'application, et définit la commande de démarrage

````Docker
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
````
# Workflow

Chaque job comprend plusieurs étapes, telles que la vérification du code, la connexion aux services cloud, la construction et le déploiement de l'image Docker.
Le workflow GitHub Actions est divisé en deux jobs :

- Job "build-and-push" pour construire et pousser l'image Docker vers Azure Container Registry. L'utilisation de hadolint permet de détecter les erreurs et les best practices dans les fichiers 

````yml
name: Build And Deploy in Azure

on: 
  push: 
    branches: 
      - Tp3 

jobs: 
  build-and-push: 
    runs-on: ubuntu-latest 
    steps: 
    - uses: actions/checkout@v2 

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Log in to Azure Container Registry 
      uses: docker/login-action@v1
      with: 
        registry: ${{ secrets.REGISTRY_LOGIN_SERVER }}
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}

    - name: Build and push Docker image to Azure Container Registry
      uses: docker/build-push-action@v2
      with: 
        context: . 
        file: ./Dockerfile 
        push: true 
        tags: ${{ secrets.REGISTRY_LOGIN_SERVER }}/20210136:v1  
      env: 
        API_KEY: ${{ secrets.API_KEY }} 

    - name: Run Hadolint 
      uses: hadolint/hadolint-action@v1.6.0
      with:
        dockerfile: Dockerfile
````
Job "deploy" pour déployer l'application sur Azure Container Instance.

````yml  
  deploy:
    needs: build-and-push 
    runs-on: ubuntu-latest 
    steps: 
    - name: Checkout code 
      uses: actions/checkout@v2

    - name: Login via Azure CLI
      uses: azure/login@v1
      with: 
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy to Azure Container Instance
      uses: azure/aci-deploy@v1
      with: 
        resource-group: ADDA84-CTP
        dns-name-label: devops-20210136
        image: ${{ secrets.REGISTRY_LOGIN_SERVER }}/20210136:v1
        name: 20210136
        location: 'francecentral' 
        registry-login-server: ${{ secrets.REGISTRY_LOGIN_SERVER }} 
        registry-username: ${{ secrets.REGISTRY_USERNAME }} 
        registry-password: ${{ secrets.REGISTRY_PASSWORD }} 
        secure-environment-variables: API_KEY=${{ secrets.API_KEY }}
        ports: 8081
````

Ainsi, on peut voir le développement et déploiement du workflow sur Azure 

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/1978a250-1292-46c0-b464-8455900864b1)

La commande suivante permet de renvoyer la météo de la ville correspondant aux latitudes et longitudes :

````cmd
curl "http://devops-20210136.francecentral.azurecontainer.io:8081/?lat=5.902785&lon=102.754478"
````
![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/ccc148bd-6abe-4402-b20f-fbc6e7f8c5e1)

Il est également possible d'avoir le contenu via une page web :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/0f210e54-2a4d-4e2c-a93d-08daf41b842c)


Finalement cette commande permet de voir le nombre de commandes traités grâce à la librairie Prometheus 

````cmd 
curl "http://devops-20210136.francecentral.azurecontainer.io:8081/metrics"
````

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/de7f0150-790c-410d-8665-053e4dc44d10)


Conclusion

Ce TP3 a permis de mettre en pratique les principes de CI/CD en utilisant GitHub Actions pour automatiser la construction, la publication et le déploiement d'une application sur Azure. L'utilisation de ces outils permet de garantir un processus de déploiement robuste et reproductible, tout en facilitant la gestion des environnements cloud. 
Ce TP3 illustre ainsi l'importance de l'automatisation et de l'intégration continue dans le contexte de DevOps, en permettant une livraison rapide et fiable des applications tout en garantissant leur qualité et leur disponibilité.
