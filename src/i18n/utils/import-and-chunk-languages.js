/* eslint-disable */
const fs = require('fs-extra');

const generateChunkJSONTranslations = () => {
  console.log('* Chunking translations');
  const dirList = fs.readdirSync('./src/i18n/build');
  const buildDir = '/Users/sofian/Projects/bsport-saas/public/locales/';

  fs.removeSync(buildDir);
  fs.mkdirSync(buildDir);

  dirList.map((dirName) => {
    console.log(`-> ${dirName}`);
    const tr = require(`/Users/sofian/Projects/bsport-saas/src/i18n/build/${dirName}/translations.json`);
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
  console.log('---------------------');
};
generateChunkJSONTranslations();
