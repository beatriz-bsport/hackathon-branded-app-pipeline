# How it works

Translations are chunked by lib (more or less).

fr-FR is the reference language.

Other languages are translated via translate.tools.bsport.io

# Flow

* create french translation file
* add it into namespaces.json
* run yarn updateTranslations

-> concatenate all chunk into `i18n/build/fr-FR/translations.js`
-> send that to the translation service for future updates
( ~> asynchronously the translation service is sending commits to some `i18n/build/*/translations.js` files except fr-FR)
-> break all `i18n/build/*/translations.js` into smaller chunks into `src/public/locales/*/communication.json`

Every thing ready to build/pack/deploy
