# Labo 01 | [TailwindCSS](https://tailwindcss.com/) & [Symfony Mecure](https://symfony.com/doc/current/mercure.html)

## Introduction :

Un peu de text ;)

## Installation :
Récupérer le projet via git :
```
$ git clone https://github.com/robinmoquet/labo_01.git
```


1/ Installation des dépendances php, via composer :

```
$ composer update
```
2/ Installation des dépendances javascript, via npm :

```
$ npm install
```
  ou via yarn :
```
$ yarn install
```

3/ Installer la dépendance mercure, dans une dossier mercure.
    Telecharger, puis déziper le tar.gz qui correspond a votre environnement, trouvé
    sur le release suivant [Release Mercure](https://github.com/dunglas/mercure/releases)

4/ Modifier la connection a la base de donné dans le ".env",
* creation de la base de donné : ``php bin/console doctrine:database:create``
* creation des migrations : ``php bin/console make:migration``
* mise à jour de la base donné : ``php bin/console doctrine:migrations:migrate``

### Lancer

1/ Démarer le serveur php : 
```
php bin/console server:run
```
2/ Lancer la compilation des assets : ``yarn encore dev --watch``, ou en prod ``yarn encore production``

3/ Lancer le hub mercure : 
```
JWT_KEY='aVerySecretKey' ADDR='localhost:3000' ALLOW_ANONYMOUS=1 CORS_ALLOWED_ORIGINS=http://localhost:8000 ./mercure
```
