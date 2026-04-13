#!/usr/bin/env node

import { readdirSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { runInNewContext } from "vm";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..", "..");
const runtimeEnvDir = resolve(
  repoRoot,
  "apps/applications/studio-manager/host/envs",
);

const LEGACY_TO_STUDIO_RUNTIME_KEY_MAPPING = Object.freeze({
  VITE_API_BASE_URL: "API_BASE_URL",
});

const asSortedKeys = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return Object.keys(value).sort();
};

const parseStudioRuntimeKeys = (filePath) => {
  const source = readFileSync(filePath, "utf-8");
  const sandbox = {
    window: {},
  };

  runInNewContext(source, sandbox, { timeout: 100 });
  const runtimeKeys = asSortedKeys(sandbox.window.__SM_RUNTIME__);

  if (!runtimeKeys) {
    throw new Error("Expected window.__SM_RUNTIME__ to be an object");
  }

  return runtimeKeys;
};

const parseLegacyRuntimeKeys = (filePath) => {
  const source = readFileSync(filePath, "utf-8");
  const sandbox = {
    window: {},
  };

  runInNewContext(source, sandbox, { timeout: 100 });
  const runtimeKeys = asSortedKeys(sandbox.window.runtime?.env);

  if (!runtimeKeys) {
    throw new Error("Expected window.runtime.env to be an object");
  }

  return runtimeKeys;
};

const keysDiff = ({ expected, received }) => {
  const expectedSet = new Set(expected);
  const receivedSet = new Set(received);
  const missing = expected.filter((key) => !receivedSet.has(key));
  const extra = received.filter((key) => !expectedSet.has(key));

  return { missing, extra };
};

const validateRuntimeGroup = ({
  groupName,
  files,
  referenceFileName,
  parseKeys,
}) => {
  if (files.length === 0) {
    throw new Error(`No files found for ${groupName}`);
  }

  const referenceFile = files.includes(referenceFileName)
    ? referenceFileName
    : files[0];
  const referencePath = resolve(runtimeEnvDir, referenceFile);
  const referenceKeys = parseKeys(referencePath);

  const errors = [];
  for (const fileName of files) {
    const filePath = resolve(runtimeEnvDir, fileName);

    let currentKeys;
    try {
      currentKeys = parseKeys(filePath);
    } catch (error) {
      errors.push(
        `[${groupName}] ${fileName}: ${(error && error.message) || String(error)}`,
      );
      continue;
    }

    const { missing, extra } = keysDiff({
      expected: referenceKeys,
      received: currentKeys,
    });

    if (missing.length > 0 || extra.length > 0) {
      errors.push(
        `[${groupName}] ${fileName}: keys mismatch vs ${referenceFile} (missing: ${missing.join(", ") || "none"} | extra: ${extra.join(", ") || "none"})`,
      );
    }
  }

  return {
    groupName,
    referenceFile,
    referenceKeys,
    errors,
  };
};

const indexFilesByEnvironment = ({ files, suffix }) => {
  return files.reduce((accumulator, fileName) => {
    const envName = fileName.slice(0, -suffix.length);
    accumulator[envName] = fileName;
    return accumulator;
  }, {});
};

const validateLegacyToStudioKeyContract = ({
  legacyFiles,
  studioFiles,
  legacyReferenceKeys,
  studioReferenceKeys,
}) => {
  const errors = [];

  const mappingEntries = Object.entries(LEGACY_TO_STUDIO_RUNTIME_KEY_MAPPING);
  const mappingKeys = mappingEntries.map(([legacyKey]) => legacyKey).sort();
  const mappingValues = mappingEntries
    .map(([, studioKey]) => studioKey)
    .sort();

  const unmappedLegacyReferenceKeys = legacyReferenceKeys.filter(
    (legacyKey) => !mappingKeys.includes(legacyKey),
  );
  if (unmappedLegacyReferenceKeys.length > 0) {
    errors.push(
      `[legacy<->studio contract] Missing mapping for legacy keys: ${unmappedLegacyReferenceKeys.join(", ")}`,
    );
  }

  const extraLegacyMappings = mappingKeys.filter(
    (legacyKey) => !legacyReferenceKeys.includes(legacyKey),
  );
  if (extraLegacyMappings.length > 0) {
    errors.push(
      `[legacy<->studio contract] Mapping contains unknown legacy keys: ${extraLegacyMappings.join(", ")}`,
    );
  }

  const missingMappedStudioReferenceKeys = mappingValues.filter(
    (studioKey) => !studioReferenceKeys.includes(studioKey),
  );
  if (missingMappedStudioReferenceKeys.length > 0) {
    errors.push(
      `[legacy<->studio contract] Mapped studio keys missing from studio reference: ${missingMappedStudioReferenceKeys.join(", ")}`,
    );
  }

  const legacyFilesByEnvironment = indexFilesByEnvironment({
    files: legacyFiles,
    suffix: ".env.js",
  });
  const studioFilesByEnvironment = indexFilesByEnvironment({
    files: studioFiles,
    suffix: ".studio-env.js",
  });

  const allEnvironmentNames = [
    ...new Set([
      ...Object.keys(legacyFilesByEnvironment),
      ...Object.keys(studioFilesByEnvironment),
    ]),
  ].sort();

  for (const environmentName of allEnvironmentNames) {
    const legacyFileName = legacyFilesByEnvironment[environmentName];
    const studioFileName = studioFilesByEnvironment[environmentName];

    if (!legacyFileName || !studioFileName) {
      errors.push(
        `[legacy<->studio contract] Missing file pair for environment '${environmentName}' (legacy: ${legacyFileName || "missing"} | studio: ${studioFileName || "missing"})`,
      );
      continue;
    }

    const legacyFilePath = resolve(runtimeEnvDir, legacyFileName);
    const studioFilePath = resolve(runtimeEnvDir, studioFileName);

    let legacyKeys;
    let studioKeys;
    try {
      legacyKeys = parseLegacyRuntimeKeys(legacyFilePath);
      studioKeys = parseStudioRuntimeKeys(studioFilePath);
    } catch (error) {
      errors.push(
        `[legacy<->studio contract] ${environmentName}: ${(error && error.message) || String(error)}`,
      );
      continue;
    }

    for (const legacyKey of legacyKeys) {
      const mappedStudioKey = LEGACY_TO_STUDIO_RUNTIME_KEY_MAPPING[legacyKey];
      if (!mappedStudioKey) {
        errors.push(
          `[legacy<->studio contract] ${environmentName}: Missing mapping for legacy key '${legacyKey}'`,
        );
        continue;
      }

      if (!studioKeys.includes(mappedStudioKey)) {
        errors.push(
          `[legacy<->studio contract] ${environmentName}: '${legacyKey}' expects studio key '${mappedStudioKey}', but it is missing in ${studioFileName}`,
        );
      }
    }
  }

  return {
    groupName: "legacy<->studio contract",
    errors,
    mapping: LEGACY_TO_STUDIO_RUNTIME_KEY_MAPPING,
  };
};

const allRuntimeFiles = readdirSync(runtimeEnvDir);
const studioRuntimeFiles = allRuntimeFiles
  .filter((fileName) => fileName.endsWith(".studio-env.js"))
  .sort();
const legacyRuntimeFiles = allRuntimeFiles
  .filter((fileName) => fileName.endsWith(".env.js"))
  .sort();

const studioValidation = validateRuntimeGroup({
  groupName: "studio-env.js",
  files: studioRuntimeFiles,
  referenceFileName: "production.studio-env.js",
  parseKeys: parseStudioRuntimeKeys,
});
const legacyValidation = validateRuntimeGroup({
  groupName: "env.js",
  files: legacyRuntimeFiles,
  referenceFileName: "production.env.js",
  parseKeys: parseLegacyRuntimeKeys,
});
const contractValidation = validateLegacyToStudioKeyContract({
  legacyFiles: legacyRuntimeFiles,
  studioFiles: studioRuntimeFiles,
  legacyReferenceKeys: legacyValidation.referenceKeys,
  studioReferenceKeys: studioValidation.referenceKeys,
});

const validations = [studioValidation, legacyValidation, contractValidation];
const allErrors = validations.flatMap((validation) => validation.errors);

if (allErrors.length > 0) {
  console.error("Runtime env keys check failed.");
  allErrors.forEach((error) => {
    console.error(`- ${error}`);
  });
  process.exit(1);
}

console.log(
  `[runtime-env-check] studio-env.js: ${studioValidation.referenceFile} keys => ${studioValidation.referenceKeys.join(", ")}`,
);
console.log(
  `[runtime-env-check] env.js: ${legacyValidation.referenceFile} keys => ${legacyValidation.referenceKeys.join(", ")}`,
);
console.log(
  `[runtime-env-check] legacy<->studio contract mapping => ${Object.entries(contractValidation.mapping)
    .map(([legacyKey, studioKey]) => `${legacyKey}->${studioKey}`)
    .join(", ")}`,
);
console.log("Runtime env keys check passed.");
