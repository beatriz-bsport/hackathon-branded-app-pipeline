#!/usr/bin/env node
import { parseArgs } from "node:util";

import {
  createDotenvValues,
  createSyntheticIssueRefs,
  getErrorMessage,
  resolveLinearReleaseIssueRefs,
  serializeDotenv,
  writeDotenvFile,
} from "./linear-release-issues.mts";

async function main(): Promise<void> {
  const {
    values: { tag, output, "create-synthetic-refs": createSyntheticRefs },
  } = parseArgs({
    options: {
      tag: { type: "string" },
      output: { type: "string" },
      "create-synthetic-refs": { type: "boolean", default: false },
    },
  });

  if (!tag) {
    throw new Error("--tag is required");
  }

  const result = await resolveLinearReleaseIssueRefs({ tag });
  const syntheticRefs = createSyntheticRefs
    ? createSyntheticIssueRefs(result.issueRefs)
    : [];
  const values = createDotenvValues(result.issueIds, {
    baseRef: result.baseRef,
    syntheticRefs,
  });

  if (output) {
    writeDotenvFile(output, values);
  }

  console.log(serializeDotenv(values).trim());
}

main().catch((error: unknown) => {
  console.error(getErrorMessage(error));
  process.exitCode = 1;
});
