# Rapport TP1 - DEVOPS

Dans le cadre du TP, nous devions créer un wrapper qui retourne la météo d'un lieu donné à partir de sa latitude et sa longitude, en utilisant l'API openweathermap. Le code devait ensuite être packagé dans une image Docker et mis à disposition sur DockerHub, ainsi que sur un repository Github. Pour ce faire, j'ai choisi de réaliser les objectifs en utilisant Node.js. 

1. Choix Techniques
2. 
•	Langage de programmation : Node.js offre une syntaxe JavaScript simple permettant d’effectuer facilement des requêtes http grâce à Axios.
•	Docker: J'ai utilisé l'image officielle Node.js Alpine comme base pour l'image Docker, pour réduire la taille de l'image. 
•	Gestion des variables d’environnement : J'ai utilisé le module dotenv pour charger les variables d'environnement à partir d'un fichier .env afin d’éviter de donner accès aux données sensibles.

3. Étapes Réalisées
   
1.	Développement du Wrapper : J'ai en premier développé un wrapper en Node.js qui utilise Axios pour interroger l'API openweathermap et afficher les données météorologiques.


2.	Création du Dockerfile : J'ai rédigé un Dockerfile pour packager l'application Node.js dans une image Docker. Le Dockerfile installe les dépendances et définit la commande par défaut pour démarrer le serveur.

3.	Données Sensibles : J’ai mis en place un .env afin de stocker les données sensibles

4.	Publication sur DockerHub : J'ai construit l'image Docker localement à l'aide du Dockerfile 


On peut le run grâce à cette commande :

Voici l’image sur Docker (On peut voir 0 vulnerabilities) :







5.	J’ai ensuite publié sur DockerHub :
 
L’API qui renvoie la météo en utilisant la commande suivante en utilisant votre image :
 
Finalement, j’ai utilisé Trivy afin de vérifier la présence de vulnérabilités :
 
Ici il n’y a donc aucun CVE
3. Difficultés Rencontrées
•	Vulnérabilités : La plus grande difficulté était de retirer chaque vulnérabilité et donc de trouver la signification de chaque et comprendre les méthodes à utiliser pour les enlever.
Ce TP m'a permis de comprendre la création d'images Docker, la gestion des variables d'environnement et l'intégration de services tiers via des APIs.
