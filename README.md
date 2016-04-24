# Auto Download Manager

Version Beta

## Download

#### OSX ~ [Télécharger v.0.9.4](https://github.com/Kilhog/AutoDownloadManager/releases/download/0.9.4/AutoDownloadManager-darwin-x64.zip)
#### Windows 32 ~ [Télécharger v.0.9.4](https://github.com/Kilhog/AutoDownloadManager/releases/download/0.9.4/AutoDownloadManager-win32-ia32.zip)
#### Windows 64 ~ [Télécharger v.0.9.4](https://github.com/Kilhog/AutoDownloadManager/releases/download/0.9.4/AutoDownloadManager-win32-x64.zip)
#### Linux 32 ~ [Télécharger v.0.9.4](https://github.com/Kilhog/AutoDownloadManager/releases/download/0.9.4/AutoDownloadManager-linux-ia32.zip)
#### Linux 64 ~ [Télécharger v.0.9.4](https://github.com/Kilhog/AutoDownloadManager/releases/download/0.9.4/AutoDownloadManager-linux-x64.zip)

Auto Download Manager est un outil qui permet de gérer vos séries automatiquement.
En gros le principe est le suivant:
* Vous vous connecté avec votre compte BetaSeries
* L'application affiche les épisodes non-vues
* Vous pouvez télécharger les épisodes non-vues (Recherche les torrents sur RarBG & Kat.cr)
* Vous pouvez sélectionner entre 480p & 720p pour les épisodes
* Vous pouvez connecter l'application à Transmission pour lancer les torrents en 1-click
* Vous pouvez télécharger les sous-tires VF (Recherche sur addic7ed.com)
* Vous pouvez marqué un épisode comme "vue" (Directement synchronisé avec votre compte Betaseries)

![Imgur](http://i.imgur.com/KmVWWjH.png)

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

Et voila ça fait des Chocapic !
