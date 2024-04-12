# Rapport TP1 - DEVOPS

# Objectifs

Pour ce travail pratique, les objectifs étaient les suivants :

- Créer un repository Github avec votre identifiant EFREI.
- Créer un wrapper retournant la météo d'un lieu donné avec sa latitude et sa longitude, en utilisant l'API openweathermap dans le langage de programmation de votre choix.
- Packager le code dans une image Docker.
- Mettre à disposition l'image sur DockerHub.
- Mettre à disposition le code dans un repository Github.

## Livrables

Les livrables attendus étaient :

- L'URL du repository Github public contenant le Dockerfile et le wrapper.
- L'URL du registry DockerHub public.
- Un rapport détaillant les choix techniques, les commandes utilisées et les difficultés rencontrées.

## Notation

La notation était basée sur :

- Disponibilité du code sur Github.
- La construction réussie du Dockerfile.
- La disponibilité de l'image Docker sur DockerHub.
- L'API renvoyant la météo en utilisant l'image Docker fournie.

### Bonus

Des points bonus étaient attribués pour :

- Aucune CVE (vérifié avec trivy) dans l'image Docker.
- Aucune erreur de lint dans le Dockerfile (vérifié avec hadolint).
- Aucune donnée sensible stockée dans l'image.

# Introduction

Dans le cadre de ce travail pratique, l'objectif était de créer un wrapper qui retourne la météo d'un lieu donné à partir de sa latitude et sa longitude, en utilisant l'API openweathermap. Ce wrapper devait être ensuite packagé dans une image Docker et rendu disponible sur DockerHub, ainsi que sur un repository Github. Pour atteindre ces objectifs, j'ai choisi d'utiliser le langage de programmation Node.js.

# Réalisation

- **Langage de programmation :** Node.js offre une syntaxe JavaScript simple permettant d’effectuer facilement des requêtes http grâce à Axios.
- **Docker :** J'ai utilisé l'image officielle Node.js Alpine comme base pour l'image Docker, pour réduire la taille de l'image.
- **Gestion des variables d’environnement :** J'ai utilisé le module dotenv pour charger les variables d'environnement à partir d'un fichier .env afin d’éviter de donner accès aux données sensibles.

## Étapes Réalisées


### Développement du Wrapper qui utilise Axios pour interroger l'API openweathermap et afficher les données météorologiques.

````javascript
require('dotenv').config();

const axios = require('axios');

const API_KEY = process.env.API_KEY;
const LATITUDE = process.env.LAT;
const LONGITUDE = process.env.LONG;

async function fetchWeatherData() {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: LATITUDE,
                lon: LONGITUDE,
                appid: API_KEY
            }
        });
        
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
}

fetchWeatherData();
````

Ce code Node.js commence par charger les variables d'environnement à partir du fichier .env pour obtenir la clé d'API et les coordonnées géographiques. 
Ensuite, il utilise Axios pour effectuer une requête à l'API OpenWeather avec les coordonnées fournies, récupère les données météorologiques et les affiche dans la console.

### Fichier ENV : 

Le fichier env permet de stocker les données sensibles et sera mis dans le .gitignore :

````env
API_KEY=****
LAT=48.858370
LONG=2.294481
````

Ce fichier contient la clé d'API OpenWeather ainsi que les coordonnées géographiques de l'emplacement dont nous voulons obtenir les données météorologiques.

### Docker File :

Le Dockerfile est utilisé pour packager l'application Node.js dans une image Docker. Le Dockerfile installe les dépendances et définit la commande par défaut pour démarrer le serveur.

```Dockerfile
FROM node:alpine3.19
WORKDIR /weather-docker
COPY . .
RUN npm install
RUN apk update && apk upgrade
RUN apk add openssl
EXPOSE 8080
CMD ["node", "server.js"]
````

Ce Dockerfile utilise l'image officielle Node.js Alpine comme base. Il copie d'abord tous les fichiers du répertoire de travail local dans le conteneur, puis installe les dépendances Node.js avec npm install. Ensuite, il met à jour et met à niveau les packages apk pour assurer la sécurité, ajoute openssl pour les besoins de l'application, expose le port 8080 sur lequel l'API sera accessible, et enfin définit la commande de démarrage du serveur.

### Publication sur DockerHub : 

1. La construction de l'image Docker localement à l'aide du Dockerfile se fait à travers la commande 

````docker

docker build -t docker-image-weather .
````

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/9cccac75-4096-4933-b6a9-4dde78206c39)


2. On peut le run grâce à cette commande :

````docker
docker run --env LAT="31.2504" --env LONG="-99.2506" --env API_KEY=**** docker-image-weather
````

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/38d9e3f0-366f-419c-8056-50757b3c717c)

3. On peut également inspecter les vulnérabilités sur Docker Desktop : 

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/f3ef08e7-b973-409d-b6a6-7b59c217f7c8)

4. Ensuite on peut publier l'image sur DockerHub :

````docker
docker tag ec654e6746d4 fannyc13/weather-repository:docker-image-weather                           
docker push fannyc13/weather-repository:docker-image-weather
docker login
````
![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/74a1ee4d-f910-4c8a-8be9-d8d6405a490e)
![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/28ac64af-cf42-406f-9dd5-182462b53715)

L’API qui renvoie la météo en utilisant la commande suivante :

````docker
docker run --env LAT="31.2504" --env LONG="-99.2506" --env API_KEY=**** fannyc13/weather-docker-repository:docker-image-weather
````

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/6a56c955-d5f9-47bd-b528-67bad00b89dc)

Finalement, l'utilisation de Trivy a permis de vérifier la présence de vulnérabilités :

````docker

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.18.3 fannyc13/weather-docker-repository:docker-image-weather
````

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/9fa603be-fd04-4de4-aad3-36e709ffc1f6)

Ici il n’y a donc aucun CVE


## Conclusion

# Importance pour DevOps

La principale difficulté rencontrée a été la gestion des vulnérabilités, nécessitant une compréhension approfondie de chaque CVE et des méthodes pour les résoudre. 
Cependant, malgré les défis rencontrés, ce TP a permis de comprendre le développement et le déploiement d'images sur Docker. Il a permis de mettre en lumière l'importance de l'automatisation et de la standardisation des processus de développement et de déploiement, ce ce qui permet d'accélérer le cycle de développement, améliorer la qualité du code et garantir des déploiements plus rapides et plus fiables.
