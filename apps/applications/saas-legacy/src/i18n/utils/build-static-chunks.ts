const fs = require('fs-extra');
const path = require('path');
const jsonMerger = require('json-merger');

function buildStaticChunks() {
  // Clean up /public/locales directory
  const pathToPublicLocales = '../../../public/locales';
  const buildDir = path.join(
    path.dirname(fs.realpathSync(__filename)),
    pathToPublicLocales,
  );
  if (fs.existsSync(buildDir)) {
    fs.removeSync(buildDir);
  }
  fs.mkdirSync(buildDir);

  const sourceTranslationsFilePath = path.join(
    path.dirname(fs.realpathSync(__filename)),
    '../source/translations.json',
  );

  const locales = fs.readdirSync('./src/i18n/locales');

  locales.forEach((locale: string) => {
    // Init directory /public/locales/{locale}
    const localeBuildDir = path.join(buildDir, locale);
    if (!fs.existsSync(localeBuildDir)) {
      fs.mkdirSync(localeBuildDir);
    }

    // Resolve path to locale translations file
    const translationFilePath = path.join(
      path.dirname(fs.realpathSync(__filename)),
      `../locales/${locale}/translations.json`,
    );

    // Resolve translations dict
    let translations;
    if (locale === 'en') {
      // By default, propagate values from the source translations file
      // to the en translations file.
      translations = jsonMerger.mergeFiles([
        sourceTranslationsFilePath,
        translationFilePath,
      ]);
    } else {
      translations = require(translationFilePath);
    }

    Object.entries(translations).forEach(
      ([namespace, namespaceTranslations]) => {
        const namespaceTranslationsPath = path.resolve(
          localeBuildDir,
          `${namespace}.json`,
        );
        fs.writeFileSync(
          namespaceTranslationsPath,
          JSON.stringify(namespaceTranslations, null, 2),
        );
      },
    );
    // eslint-disable-next-line no-console
    console.log(`> Built ${locale} translations`);
  });
}

buildStaticChunks();

// Add export clause to convert the scrip to an ESModule and prevent global variables collision
export {};
