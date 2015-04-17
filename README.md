# Auto Download Manager

Auto Download Manager est un outil qui permet de télécharger vos séries automatiquement.

## Procédure d'installation

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

### Lancement d'atom-shell

Ouvrez un terminal et faites :

	cd /path/to/my/folder
	
	gulp

ou

	gulp compile

(Pour concatener et minifier les fichiers)	
Et voila ça fait des Chocapic !
