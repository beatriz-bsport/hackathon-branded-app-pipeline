INSTALLATION
============

Running with a local backend server
-----------------------------------
Follow instructions https://gitlab.com/bsport/bsport-django

```sh
cp ./envs/dev ./env.js
```

This will prepare the db and create test accounts

Running with the distant (staging) backend server
-------------------------------------------------

```sh
cp ./envs/local ./env.js
```

GENERATE TRANSLATIONS
=====================
```sh
yarn updateTranslation
```

LOGIN
=====

You can use the following user

```sh
username: contact@classdiggers.com
password: demo
```

RUN
===

Now you can run
```sh
yarn       // install all deps
yarn start // start the dev server
```
