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

CREATE NEW ALLIAS
=================

To create a new allias you need to add them at multiple places

### .babelrc
```
  "alias": {
    ...
    "#newAlias": "PATH TO NEW ALIAS FROM THE BABELRC FILE",
  }
```

### .eslintrc
```
  "alias": {
    ...
    "#newAlias": "PATH TO NEW ALIAS FROM THE ESLINTRC FILE",
  }
```

### .tsconfig.json
```
  "paths": {
    ...
    "#newAlias/*": ["PATH TO NEW ALIAS FROM THE TSCONFIG FILE"/*],
  }
```

### config/webpack.config.dev.js and config/webpack.config.js
```
  "paths": {
    ...
    '#components': path.resolve(__dirname, ["PATH TO NEW ALIAS FROM THE WEBPACK FILE"/),
  }
```

the alias need to respect some convention use a # as a prefix to make it clear it's not a path and can't have a / inside to avoid resolving problems

> :warning: **Don t break the widget**: Until better bundling for the widget we also need to add the alias configuration in the widget's webpack otherwise it will break the build
