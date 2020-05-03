/* eslint-disable */

const fs = require('fs-extra');
const NAMESPACES = require('../namespaces.json');

const generateSourceTranslations = (lang) => {
  console.log('* Generating the source translation');
  const concatenatedTranslations = NAMESPACES.reduce((acc, ns) => {
    let m = { default: {} };
    try {
      m = require(`../${lang}/${ns}.translations`);
    } catch (err) {
      console.log(`MISSING: ${ns}`);
    }
    return { ...acc, [ns]: m.default };
  }, {});

  fs.writeFileSync(
    `./src/i18n/build/${lang}/translations.json`,
    JSON.stringify(concatenatedTranslations),
  );
  console.log('* Generation successful');
  console.log('---------------------');
};

generateSourceTranslations('fr-FR');
