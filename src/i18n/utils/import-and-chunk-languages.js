/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const jsonMerger = require('json-merger');

const generateChunkJSONTranslations = () => {
  console.log('* Chunking translations');
  const dirList = fs.readdirSync('./src/i18n/build');
  const buildDir = path.join(
    path.dirname(fs.realpathSync(__filename)),
    '../../../public/locales/',
  );

  fs.removeSync(buildDir);
  fs.mkdirSync(buildDir);

  dirList.map((dirName) => {
    console.log(`- ${dirName}`);
    let tr = {}
    if (dirName === 'fr') {
      tr = jsonMerger.mergeFiles([
	path.join(
	  path.dirname(fs.realpathSync(__filename)),
	  '../build/fr/translations.json',
	),
	path.join(
	  path.dirname(fs.realpathSync(__filename)),
	  '../build/af/translations.json',
	),
      ])
    } else {
      tr = require(path.join(
	path.dirname(fs.realpathSync(__filename)),
	`../build/${dirName}/translations.json`,
      ));
    }
    Object.entries(tr).map(([key, value]) => {
      try {
        fs.mkdirSync(`${buildDir}${dirName}/`);
      } catch (err) {
        // console.error(err);
      }
      fs.writeFileSync(
        `${buildDir}${dirName}/${key}.json`,
        JSON.stringify(value),
      );
    });
  });
  console.log('> Done !\n');
};
generateChunkJSONTranslations();
