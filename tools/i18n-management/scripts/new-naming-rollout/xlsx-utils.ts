import * as XLSX from "@e965/xlsx";

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
