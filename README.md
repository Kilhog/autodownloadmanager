# Auto Download Manager

Version Beta

## Download

### OSX ~ [Télécharger v.0.9.0](https://github.com/Kilhog/autodownloadmanager/blob/master/build/AutoDownloadManager_0_9_0.app.tar.gz?raw=true)

Auto Download Manager est un outil qui permet de gérer vos séries automatiquement.
En gros le principe est le suivant:
* Vous vous connecté avec votre compte BetaSeries
* L'application affiche les épisodes non-vues
* Vous pouvez télécharger les épisodes non-vues (Recherche les torrents sur GetStrike & Kat.cr)
* Vous pouvez sélectionner entre 480p & 720p pour les épisodes
* Vous pouvez connecter l'application à Transmission pour lancer les torrents en 1-click
* Vous pouvez télécharger les sous-tires VF (Recherche sur addic7ed.com)
* Vous pouvez marqué un épisode comme "vue" (Directement synchronisé avec votre compte Betaseries)

Actuellement l'application n'est pas "packagé" donc vous devez utiliser cette procédure ci-dessous pour démarrer l'application.

![Alt text](http://i.imgur.com/cODGSXK.png)

## Installation pour les développeurs

### Installer node & npm

Rendez-vous sur [nodejs.org](https://nodejs.org/) et cliquez sur le gros bouton "INSTALL".

Après l'installation vérifiez que npm est bien installé en ouvrant un terminal et en tapant :

	npm -v

### Récupération du dépot git

Créez un dossier, ensuite ouvrez un terminal et faites :

	cd /path/to/my/folder
	git clone https://***@bitbucket.org/***/autodownloadmanager.git .

Remplacez l'adresse du dépot par la votre (présent dans le dépot BitBucket).

### Installation des dépendances

Ouvrez un terminal et faites :

	cd /path/to/my/folder
	npm install

### Installation de gulp en global

Ouvrez un terminal et faites :

	npm install -g gulp


### Lancement d'Electron

Ouvrez un terminal et faites :

	cd /path/to/my/folder
	gulp

ou

	gulp compile

(Pour concatener et minifier les fichiers)

Et voila ça fait des Chocapic !
