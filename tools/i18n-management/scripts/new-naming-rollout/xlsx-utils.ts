import * as XLSX from "@e965/xlsx";
import fs from "node:fs";
import path from "node:path";

import { getMonorepoBasePathSync } from "@bsport/typescript-monorepo-utils";

import { getUpdatedStringI18nKey } from "#src/utils/get-updated-string-i18n-key";

const COLUMN_PROJECT = "Project";
const COLUMN_NAMESPACE = "Namespace";
const COLUMN_I18N_KEY = "Key";
const PREVIOUS_SUFFIX = "previous";
const NEW_SUFFIX = "new";
const VALIDATED_SUFFIX = "validated";

function buildHeaders(languages: string[]): string[] {
  const base = [COLUMN_PROJECT, COLUMN_NAMESPACE, COLUMN_I18N_KEY];

  const languagesColumns = languages.flatMap((language) => [
    `${language}_${PREVIOUS_SUFFIX}`,
    `${language}_${NEW_SUFFIX}`,
    `${language}_${VALIDATED_SUFFIX}`,
  ]);

  return [...base, ...languagesColumns];
}

export function generateTranslationUpdateXlsx({
  rows,
  selectedLanguages,
  title,
}: {
  rows: Array<Array<string | boolean>>;
  selectedLanguages: string[];
  title: string;
}) {
  const headers = buildHeaders(selectedLanguages);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Translations");

  XLSX.writeFile(workbook, `${title}.xlsx`);
}

type SheetRow = Record<string, string | boolean | null | "TRUE" | "FALSE">;

export function readXlsxAsJson(filePath: string): SheetRow[] {
  // 1. Validate extension
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".xlsx") {
    throw new Error(`Invalid file type: ${ext}. Only .xlsx is supported.`);
  }

  // 2. Validate file existence -> filePath is relative from i18n-management
  const ichizenRootPath = getMonorepoBasePathSync();
  const filePathFromRoot = path.resolve(ichizenRootPath, filePath);
  let finalFilePath = filePathFromRoot;

  if (!fs.existsSync(filePathFromRoot)) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    finalFilePath = filePath;
  }

  // 3. Read workbook
  const workbook = XLSX.readFile(finalFilePath, {
    cellDates: true,
  });

  // 4. Select first sheet (or change if needed)
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("XLSX file contains no sheets.");
  }

  const worksheet = workbook.Sheets[sheetName];

  // 5. Convert sheet → JSON
  const json = XLSX.utils.sheet_to_json<SheetRow>(worksheet, {
    defval: null, // preserve empty cells
    raw: false, // format values (important for booleans / dates)
  });

  return json;
}

type TransformedData = {
  [projectName: string]: {
    [language: string]: Array<{ i18nKey: string; newValue: string }>;
  };
};

/**
 * Transform sheet JSON into grouped structure by project and language
 */
export function groupSheetRowsByProjectAndLanguage({
  rows,
  override,
  force,
}: {
  rows: SheetRow[];
  override: boolean;
  force: boolean;
}): TransformedData {
  const result: TransformedData = {};
  rows.forEach((row) => {
    const project = row[COLUMN_PROJECT] as string;
    const namespace = row[COLUMN_NAMESPACE] as string;

    if (!project || !namespace) return; // skip invalid rows

    // For each column, check if it's a *_validated column
    Object.keys(row).forEach((col) => {
      const match = col.match(/^([a-z]{2})_validated$/i); // matches "en_validated", "fr_validated", etc.
      if (!match) return;

      const lang = match[1]; // "en", "fr", etc.
      const validated = row[col];

      if (
        validated !== true &&
        validated !== "true" &&
        validated !== "TRUE" &&
        !force
      ) {
        return; // skip non-validated when force = false
      }

      const newValueCol = `${lang}_${NEW_SUFFIX}`;

      const i18nKey = getUpdatedStringI18nKey({
        override,
        sourceKey: `${namespace}.${row[COLUMN_I18N_KEY]}`,
      });

      const newValue = (row[newValueCol] as string) ?? "";

      if (!newValue) {
        // Don't include empty values
        return;
      }

      if (!result[project]) result[project] = {};
      if (!result[project][lang]) result[project][lang] = [];

      result[project][lang].push({ i18nKey, newValue });
    });
  });

  return result;
}
