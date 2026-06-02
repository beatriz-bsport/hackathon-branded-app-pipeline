import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Root of the @bsport/kaizen-docs package. */
export const DOCS_ROOT = path.resolve(HERE, "..", "..");

/** Local build output from `pnpm generate` (.md exports, llms.txt). */
export const GENERATED_DIR = path.join(DOCS_ROOT, ".generated");
