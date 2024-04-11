# Rapport TP1 - DEVOPS

Dans le cadre du TP, nous devions créer un wrapper qui retourne la météo d'un lieu donné à partir de sa latitude et sa longitude, en utilisant l'API openweathermap. Le code devait ensuite être packagé dans une image Docker et mis à disposition sur DockerHub, ainsi que sur un repository Github. Pour ce faire, j'ai choisi de réaliser les objectifs en utilisant Node.js. 

1. Choix Techniques
   
•	Langage de programmation : Node.js offre une syntaxe JavaScript simple permettant d’effectuer facilement des requêtes http grâce à Axios.
•	Docker: J'ai utilisé l'image officielle Node.js Alpine comme base pour l'image Docker, pour réduire la taille de l'image. 
•	Gestion des variables d’environnement : J'ai utilisé le module dotenv pour charger les variables d'environnement à partir d'un fichier .env afin d’éviter de donner accès aux données sensibles.

2. Étapes Réalisées
   
1.	Développement du Wrapper : J'ai en premier développé un wrapper en Node.js qui utilise Axios pour interroger l'API openweathermap et afficher les données météorologiques.

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/39c0037d-954d-4dca-800d-f6353b6b7f27)

2.	Création du Dockerfile : J'ai rédigé un Dockerfile pour packager l'application Node.js dans une image Docker. Le Dockerfile installe les dépendances et définit la commande par défaut pour démarrer le serveur.

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/0dd0b32f-408e-47a9-8fb9-843c351a0fc0)

3.	Données Sensibles : J’ai mis en place un .env afin de stocker les données sensibles

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/a71a6c09-425c-4f3f-aa5c-3a21adc2365d)

4.	Publication sur DockerHub : J'ai construit l'image Docker localement à l'aide du Dockerfile 

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/62f10add-c10c-4dc6-8d24-5037a0f82de5)


On peut le run grâce à cette commande :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/b2a769bc-af46-4164-ace0-551c5ea27b7d)


Voici l’image sur Docker (On peut voir 0 vulnerabilities) :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/17922d84-f5e3-48ff-9678-b9ba8d259e10)

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/7262c4ed-7db6-4219-ba9d-c4fddf9f8b27)


5.	J’ai ensuite publié sur DockerHub :

 ![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/b4b81480-6c52-42a9-a74c-2a29b3025f07)

L’API qui renvoie la météo en utilisant la commande suivante en utilisant votre image :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/6a56c955-d5f9-47bd-b528-67bad00b89dc)

Finalement, j’ai utilisé Trivy afin de vérifier la présence de vulnérabilités :

![image](https://github.com/efrei-ADDA84/20210136/assets/94389445/9fa603be-fd04-4de4-aad3-36e709ffc1f6)

Ici il n’y a donc aucun CVE

3. Difficultés Rencontrées
   
•	Vulnérabilités : La plus grande difficulté était de retirer chaque vulnérabilité et donc de trouver la signification de chaque et comprendre les méthodes à utiliser pour les enlever.


Ce TP m'a permis de comprendre la création d'images Docker, la gestion des variables d'environnement et l'intégration de services tiers via des APIs.
