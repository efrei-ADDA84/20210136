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
