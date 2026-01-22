// Use mts extension because this package is not an ESM module but a CommonJS one
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { createVitestConfig } from "@bsport/config-vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createVitestConfig(__dirname);
