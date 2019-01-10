INSTALLATION
============

Running with a local backend server
-----------------------------------
First initialize a postgres db for bsport-django.
```sh
su postgres
createdb geodjango_saas
psql geodjango_saas
> CREATE EXTENSION postgis;
> CREATE EXTENSION pg_trgm;
> ALTER USER "postgres" WITH PASSWORD 'YOUR_PASSWORD_IN_BSPORT-DJANGO_.env_FILE';
```

Make sure you are in the saas git-branch of bsport-django, then run the following:
```sh
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
pipenv run python loaddata home/fixtures/*json
pipenv run python manage.py import_metro_paris emplacement-des-gares-idf.csv
pipenv run python manage.py populate_with_fake_data
```

This will prepare the db and create test accounts

Running with the distant (staging) backend server
-------------------------------------------------
Set in your `.env.local` file these variables (copy/paste `.env.template` first)
```sh
REACT_APP_BASE_URI='http://api.ci.bsport.io'
REACT_APP_API_URI='http://api.ci.bsport.io/api-v0'
REACT_APP_STRIPE_PK_KEY='pk_test_lFB5CxcyTCaQcS00MiE1ebEO'
```

LOGIN
=====

Currently the only user usable with full feature and (theorically) no bug is :

```sh
username: contact@classdiggers.com
password: demo
```

RUN
===

First prepare the linking of `bsport-commons`

```sh
pushd ../bsport-commons
yarn link
popd
yarn link bsport-commons
```

Now you can run
```sh
yarn       // install all deps
yarn start // start the dev server
```
