/* eslint-disable */

const fs = require('fs-extra');
const beautify = require('json-beautify');
const NAMESPACES = require('../namespaces.json');

const generateSourceTranslations = async (lang) => {
  console.log('* Generating the source translation...');
  const concatenatedTranslations = await NAMESPACES.reduce(async (acc, ns) => {
    const resolvedAcc = await acc;
    try {
      m = await require(`../${lang}/${ns}.translations`).default;
      return { ...resolvedAcc, [ns]: m };
    } catch (err) {
      console.log(`MISSING: ${ns}`);
      console.error('ERROR in', lang, ns);
      console.error(err);
      throw Error(`Failted to parsed: ${ns}: ${err}`);
    }
  }, {});

  fs.writeFileSync(
    `./src/i18n/build/${lang}/translations.json`,
    beautify(concatenatedTranslations, null, 2, 120),
  );
  console.log('> Done !\n');
};

generateSourceTranslations('af');
