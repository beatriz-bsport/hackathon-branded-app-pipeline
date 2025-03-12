const fs = require('fs-extra');
const beautify = require('json-beautify');
const namespaceList = require('../namespaces.json');

async function buildSourceTranslations() {
  const aggregatedTranslations: { [namespace: string]: object } = {};

  try {
    for (const namespace of namespaceList) {
      const filePath = `../translations/${namespace}.translations.js`;
      const fileContent: object = await require(filePath).default;
      aggregatedTranslations[namespace] = fileContent;
    }
  } catch (error) {
    console.error('! Failed to parse translations !');
    console.error(error);
  }

  fs.writeFileSync(
    `./src/i18n/source/translations.json`,
    beautify(aggregatedTranslations, null as any, 2, 80),
  );
}

buildSourceTranslations();

// Add export clause to convert the scrip to an ESModule and prevent global variables collision
export {};
