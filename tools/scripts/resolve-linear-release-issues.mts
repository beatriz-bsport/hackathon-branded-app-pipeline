#!/usr/bin/env node
import { parseArgs } from "node:util";

import {
  createDotenvValues,
  getErrorMessage,
  resolveLinearReleaseIssues,
  serializeDotenv,
  writeDotenvFile,
} from "./linear-release-issues.mts";

async function main(): Promise<void> {
  const {
    values: { tag, output },
  } = parseArgs({
    options: {
      tag: { type: "string" },
      output: { type: "string" },
    },
  });

  if (!tag) {
    throw new Error("--tag is required");
  }

  const issueIds = await resolveLinearReleaseIssues({ tag });
  const values = createDotenvValues(issueIds);

  if (output) {
    writeDotenvFile(output, values);
  }

  console.log(serializeDotenv(values).trim());
}

main().catch((error: unknown) => {
  console.error(getErrorMessage(error));
  process.exitCode = 1;
});
