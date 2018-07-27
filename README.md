INSTALLATION
============

First run the following
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
```sh
yarn
yarn start
```
