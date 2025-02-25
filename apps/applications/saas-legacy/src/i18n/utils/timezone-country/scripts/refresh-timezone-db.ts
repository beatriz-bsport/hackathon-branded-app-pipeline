/* eslint no-console: 0 */
import path from 'path';
import https from 'https';
import fs from 'fs';
import readline from 'readline';
import beautify from 'json-beautify';
import without from 'lodash/without';

type OutputData = { [countryCode: string]: string[] };

const IANA_ZONE_BY_COUNTRY_URL =
  'https://raw.githubusercontent.com/eggert/tz/main/zone1970.tab';

const IANA_FILE_PATH = path.resolve(
  __dirname,
  '../../../..',
  '.tmp/zone1970.tab',
);
const TZ_BY_COUNTRY_PATH = path.resolve(
  __dirname,
  '../../../..',
  'src/utils/timezone-country/data.json',
);

async function main() {
  const newData: OutputData = {};

  // 1- Download Country by zone csv
  {
    if (!fs.existsSync(IANA_FILE_PATH)) {
      fs.appendFileSync(IANA_FILE_PATH, '');
    }
    const file = fs.createWriteStream(IANA_FILE_PATH);

    await new Promise<void>((resolve) => {
      https
        .get(IANA_ZONE_BY_COUNTRY_URL, (response) => {
          console.log('⏳ Dowloading latest timezone database...');
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', (err: Error) => {
          fs.unlinkSync(IANA_FILE_PATH);
          console.error(`❌ Error when downloading.`);
          console.error(err);
          process.exit(1);
        });
    });
    console.log(
      `✅ File downloaded: ${path.relative(process.cwd(), IANA_FILE_PATH)}`,
    );
  }

  // 2- Format it as a JSON for the timzone-countries utils
  {
    console.log('⏳ Reading and parsing.');
    // Read line by line
    const input = fs.createReadStream(IANA_FILE_PATH);

    const rl = readline.createInterface({
      input,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;
    for await (const rawLine of rl) {
      lineNumber += 1;
      // Remove comments
      const line = rawLine.replace(/#.*/, '');
      if (line) {
        const [countryCodes, , timezone] = line.split('\t');

        if (!countryCodes) {
          console.log(
            `⚠️ Error on line ${lineNumber}: no country code has been found.`,
          );
        } else if (!timezone) {
          console.log(
            `⚠️ Error on line ${lineNumber}: no timezone has been found for country codes ${countryCodes}.`,
          );
        } else {
          countryCodes.split(',').forEach((code) => {
            newData[code] = [...new Set(newData[code] ?? []).add(timezone)];
          });
        }
      }
    }
    console.log('✅ Parsing finished.');
  }

  // 3- Print updates between old and new file
  if (!fs.existsSync(TZ_BY_COUNTRY_PATH)) {
    fs.openSync(TZ_BY_COUNTRY_PATH, 'a');
    console.log(
      `ℹ️  No file ${path.relative(
        process.cwd(),
        TZ_BY_COUNTRY_PATH,
      )} found. Creating it...`,
    );
  } else {
    try {
      const content = fs.readFileSync(TZ_BY_COUNTRY_PATH).toString('utf-8');
      const currentData = JSON.parse(content) as OutputData;

      const addedCountries: string[] = [];
      const modifiedCountries: {
        [code: string]: { added: string[]; removed: string[] };
      } = {};
      const removedCountries: string[] = [];

      Object.keys(currentData).forEach((code) => {
        if (!newData[code]) {
          removedCountries.push(code);
        }
      });
      Object.keys(newData).forEach((code) => {
        if (!currentData[code]) {
          addedCountries.push(code);
        } else {
          const added = without(newData[code], ...currentData[code]);
          const removed = without(currentData[code], ...newData[code]);
          if (added.length || removed.length) {
            modifiedCountries[code] = { added, removed };
          }
        }
      });

      if (removedCountries.length) {
        console.log(`ℹ️  Countries removed: ${removedCountries.join(', ')}`);
      }
      if (addedCountries.length) {
        console.log(`ℹ️  Countries added:`);
        addedCountries.forEach((code) => {
          console.log(`- ${code} (${newData[code].join(', ')}).`);
        });
      }
      const entries = Object.entries(modifiedCountries);
      if (entries.length) {
        console.log(`ℹ️  Countries edited: `);
        entries.forEach(([code, { added, removed }]) => {
          console.log(
            `- ${code} (${added.length ? `Added: ${added.join(', ')}.` : ''}${
              removed.length ? `Removed: ${removed.join(', ')}.` : ''
            })`,
          );
        });
      }
    } catch (_e) {
      console.log(
        `❌ Corrupted file content for ${path.relative(
          process.cwd(),
          TZ_BY_COUNTRY_PATH,
        )}. Overwritting it...`,
      );
    }
  }

  // 4- Write into file
  fs.writeFileSync(TZ_BY_COUNTRY_PATH, beautify(newData, null, 2, 120));
  console.log(
    `✅ File updated: ${path.relative(process.cwd(), TZ_BY_COUNTRY_PATH)}`,
  );
}

main();
