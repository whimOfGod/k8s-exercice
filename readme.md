# Workers

## Installation :

Prérequis pour ces exercices :

- minikube : https://kubernetes.io/fr/docs/tasks/tools/install-minikube/
- kubectl : https://kubernetes.io/docs/tasks/tools/

Vérifier que tout fonctionne correctement : https://kubernetes.io/docs/tutorials/hello-minikube/

- <a href="https://github.com/arthurescriou/k8s-exercice/blob/master/deploy.md">Lire deploy.md</a>

## Présentation

L'objectif du code fourni est de simuler un pattern <a href="https://en.wikipedia.org/wiki/Master/slave_(technology)">controller/agent</a>.

On a donc 2 serveurs :

- le planner qui gère les tâches à exécuter
- le worker qui exécute les tâches

### Les tâches

Pour éviter de complexifier le code on va seulement faire des multiplications et des additions, le worker prend artificiellement du temps pour simuler un temps de travail.
Les workers ne peuvent pas effectuer plusieurs tâches à la fois, ils renvoient une erreur 403 si on leur donne une nouvelle tâche alors que leur tâche en cours n'est pas fini.

### Les variables d'environment

Pour configurer plus facilement les serveurs il est possible d'utiliser les variables d'environment. (voir directement dans les readme des deux projets)

### Kubernetes

On veut utiliser Kubernetes pour lancer les différents éléments du projet. 
Pour ça on va avoir besoin de créer différents types d'objects :
- pod
- deployment
- service

Vous pouvez trouver des exemples de fichiers de configurations dans les différents dossier du projet (`service.yml`, `pod.yml`, `deployment.yml`).

A vous de les utiliser (`kubectl create/apply/delete -f file.yml`) et de les modifier pour faire les exercices.

## Exercices

### Exercice 1: Déployer un pod

Première étape lancer une exécution de 4 tâches avec un planner et un worker dans pod.

On commit!

### Exercice 2: Plusieurs workers

On veut pouvoir lancer plusieurs workers pour un seul planner pour parallèliser et accélérer l'exécution.
Pour ça il vous faudra modifier le code du planner (la ligne 12) :

```js
let workers = ['http://localhost:8080']
```

Et créer un deployment capable de gérer plusieurs pods.

Pour qu'il dispatche les tâches à chaque workers.

On commit!

### Exercice 3: Spécialisation des workers

Par défaut les workers peuvent exécuter toutes tâches. On peut cependant imaginer que certains workers sont spécialisé dans une seule tâche.
Pour ça voir les variables d'environment du worker.

- lancez des workers spécialisés et observez le comportement du planner.
- corrigez les erreurs en modifiant le code du planner.

On commit!

### Exercice 4: Nombre de worker dynamique

On repasse avec des workers généraliste.
On veut maintenant pouvoir ajouter un nombre dynamique de worker pendant l'exécution du planner.

Les nouveaux workers fraichement lancés doivent s'enregistrer auprès du planner pour pouvoir recevoir des tâches.

Trouvez un moyen de lancer un planner et une dizaine de workers pour exécuter rapidement une cinquantaine de tâches en une seule commande.

On commit!

### Exercice 5: On mélange tout

En réutilisant le code fais ci-dessus :
Créez une configuration qui exécute une centaine de tâches dispatchées parmi :

- 10 workers généralistes
- 10 workers spécialisés en multiplications
- 10 workers spécialisés en additions

On commit!

Pensez à m'envoyer un lien vers votre git sur slack ou par mail: arthur.escriou@gmail.com

### Additionnaly you can use this cheat sheets :

- <a href="https://dev.to/ssmak/cheatsheet-for-kubernetes-minikube-kubectl-1i96"> K8S</a>
