/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');

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
    console.log(`-> ${dirName}`);
    const tr = require(path.join(
      path.dirname(fs.realpathSync(__filename)),
      `../build/${dirName}/translationson`,
    ));
    Object.entries(tr).map(([key, value]) => {
      try {
        fs.mkdirSync(`${buildDir}${dirName}/`);
      } catch (err) {
        // console.error(err);
      }
      fs.writeFileSync(
        `${buildDir}${dirName}/${key}on`,
        JSON.stringify(value),
      );
    });
  });
  console.log('---------------------');
};
generateChunkJSONTranslations();
