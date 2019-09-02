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
Set in your `.env` first)
```sh
BASE_URI='http://api.ci.bsport.io'
STRIPE_PK_KEY='pk_test_lFB5CxcyTCaQcS00MiE1ebEO'
GOOGLE_MAPS_API_KEY='AIzaSyD5aOL4nVUjsFNIj3jSpCTtqHHkem8NcZM'
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
