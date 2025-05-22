const fs = require('fs-extra');
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
    // Align with Weblate formatting
    JSON.stringify(aggregatedTranslations, undefined, 4),
  );
}

buildSourceTranslations();

// Add export clause to convert the scrip to an ESModule and prevent global variables collision
export {};
