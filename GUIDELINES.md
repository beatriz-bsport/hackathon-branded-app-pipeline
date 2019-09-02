Bsport-saas
===========

First and foremost welcome to this wonderful repository. A repo full of wonders, full of reducers, and simply full of stuff. The point of this guideline is to point you how we code, how we work, and what technology do we use.

What is this ?
--------------
`bsport-saas` is one frontend of a larger project which notably includes an app (iOS and android) (please do download and rate five stars). The goal is to provides managers, coach, and customers of sports clubs a modern interface to respectively manage, exercice, and consumer sports activities (yoga, dance, boxe...).

The customer interface is "done", meaning that most of the features are coded (cf the app : search, book, pay) without pain. The next big deal is the manager interface.

Who is this for ?
-----------------
This repo focus on the manager experience. It should be absolutely bug-free as we handle here their core business (invoice, memberships, planning and all that stuff).

Where does it go ?
------------------
We want to empower managers with a modern tool. First step is to handle their business for them (almost done). Second step is to manage their data analysis and provide them useful insights on retention, clustering, hints...

What about these other projects ?
---------------------------------
The frontend is connected to a django-powered backend providing a REST API for this app, the mobile app, and smaller projects.

Enough talking let's talk tech

Technology 
==========

Packages used
-------------
* **yarn** for package management
  * version sould be >=1.12.1 
* **flow** All new components must implement https://flow.org/ declaration
  * easier for future developers to understand your API
  * easier for you (type checking) and not that tedious (if you doubt check typescript).
  * declare `// @flow` and you are good to go.
* **eslint** for linting
  * `.eslintrc` is provided for you. No PR will be merged with eslint errors.
* **prettier** for pretty and consistent coding style.
  * `.prettierrc` file is provided for you
* **https://material-ui.com/** provides most of the UI components.
  * well-maintained, well-documented and beautiful.
  * bsport has no designer. So focus only on putting together already-coded material components, designing beautiful interfaces is hard enough.
  * material-ui also provides icons, just check'em if you need
* **react-i18next** for translations. All text should be translated in english/french. If you are familiar only we one of them, DO NOT WRITE translations yourself. Write `FIXME TRANSLATE` in your translation file and ask someone.
* **redux** for all state / persistent storage 
  * one store means one object type. There are some exceptions though (consumer, marketplace, auth, router, refresh).
  * object types should be referenced in `src/api/types.js`. Actually they are probably not, but check if in doubt
  * use `createAction` in your redux actions. More consistency, and easier to read.
* REST API fetched by axios (cf `src/api/`)
* Dockerfile

Code structure
--------------

* `src/pages` : the pages (screen) only. Theorically only them do api call / dispatch redux actions. When relevant, some exceptions are accepted. Do not manipulate data outside this directory. Call here and only here the `actions.js|selectors.js|api.js`. Page get and compose the data, provide actions, the components do not need to understand that.
* `src/components` individual dumb and generic components. Should be as dumb as possible. Do not hesitate to compose them.
* `src/libs/` are "métier" library, example: invoice
  * `./components` contains the UI/UX
  * `./api.js` the api call
  * `./actions|reducers.js` the redux stuff
  * `./selectors.js` how to get stuff from the redux store
  * `./types.js` flow types
* `src/i18n/` includes all translations

Workflow
--------
We use git as you can see
* master branch is protected : you must not push on it
* one feature = one PR (pull request) derived from master
* try to push your code once everyday (if relevant). It's easier to help and correct you.
* all code on master branch is automatically available after some CI steps on https://backoffice.staging.bsport.io
* Sofian is the default approver for all PR, you can add other approvers but do not merge yourself.

Misc
----
* userspaces (routes families) are different depending on what *kind* of user you are, you may be redirected to a different userspace (router) with a different login
  * manager are redirected to `src/pages/Backoffice.component.js` router
  * customers to `src/pages/ConsumerHome.component.js` (minimal interface : customer should use the mobile app for that)
  * everyone can access `src/pages/MarketPlace.component.js`
  
