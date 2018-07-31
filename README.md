INSTALLATION
============

First initialize a postgres db for bsport-django. Default name is currently geodjango_saas in bsport-django.
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
Currently the only user usable with full feature and (theorically) no bug is :

```sh
username: manager@bsport.io
password: test
```

RUN
===

Go at the root of this project and run
```sh
yarn
yarn start
```
