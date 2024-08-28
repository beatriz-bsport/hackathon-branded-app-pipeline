import convertExport from "../src";

convertExport().catch((err) => {
  console.error(`❌  Error when importing kaizen-token:`);
  throw err;
});
