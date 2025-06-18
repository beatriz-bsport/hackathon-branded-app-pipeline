import { Environment } from "@bsport/envs";

import { CompanyTypeEnum } from "./constants";

/**
 * Generates an Unlayer user object for the development environment.
 *
 * The user ID format is: `${currentEnv}-${companyType}-test-${isStudioIdOdd}`.
 * - Example: `"local-company-test-odd"` for a local company with an even companyId.
 * - In development, IDs are not strictly unique to allow sharing, but are separated by environment.
 * The email and name fields are also generated based on the environment and company type.
 *
 * @param {Object} params - The parameters for generating the user.
 * @param {Environment} params.currentEnv - The current environment (e.g., 'local', 'dev').
 * @param {number} params.companyId - The unique identifier for the company.
 * @param {CompanyTypeEnum} params.companyType - The type of the company (e.g., 'company', 'franchise').
 * @returns {UnlayerUser} The generated Unlayer user object for development.
 *
 * @example
 * getDevelopmentUnlayerUser({
 *   currentEnv: 'local',
 *   companyId: 2,
 *   companyType: CompanyTypeEnum.COMPANY
 * });
 * // {
 * //   id: 'local-company-test-odd',
 * //   email: 'local.company.odd@bsport.io',
 * //   name: 'local-company odd'
 * // }
 */
export function getDevelopmentUnlayerUser({
  currentEnv,
  companyId,
  companyType,
}: {
  currentEnv: Environment;
  companyId: number;
  companyType: CompanyTypeEnum;
}) {
  const isStudioIdOdd = companyId % 2 === 0 ? "odd" : "even";
  const testId = `${currentEnv}-${companyType}-test-${isStudioIdOdd}`;

  return {
    id: testId,
    email: `${currentEnv}.${companyType}.${isStudioIdOdd}@bsport.io`,
    name: `${currentEnv}-${companyType} ${isStudioIdOdd}`,
  };
}

/**
 * Generates an Unlayer user object for the production environment.
 *
 * The user ID format is: `${companyType}-${companyId}`.
 * - Example: `"company-2"` or `"franchise-5"`.
 * - In production, IDs must be unique and do not share data between companies or franchises.
 * The email and name fields are provided directly.
 *
 * @param {Object} params - The parameters for generating the user.
 * @param {number} params.companyId - The unique identifier for the company.
 * @param {string} params.companyEmail - The email address of the user logged in as the company.
 * @param {string} params.companyName - The name of the company.
 * @param {CompanyTypeEnum} params.companyType - The type of the company (e.g., 'company', 'franchise').
 * @returns {UnlayerUser} The generated Unlayer user object for production.
 *
 * @example
 * getProductionUnlayerUser({
 *   companyId: 2,
 *   companyEmail: 'contact@company.com',
 *   companyName: 'Company Name',
 *   companyType: CompanyTypeEnum.COMPANY
 * });
 * // {
 * //   id: 'company-2',
 * //   email: 'contact@company.com',
 * //   name: 'Company Name'
 * // }
 */
export function getProductionUnlayerUser({
  companyId,
  companyName,
  companyType,
  companyEmail,
}: {
  companyId: number;
  companyEmail: string;
  companyName: string;
  companyType: CompanyTypeEnum;
}) {
  const unlayerUserId =
    companyType === CompanyTypeEnum.FRANCHISE
      ? `franchise-${companyId}`
      : `company-${companyId}`;

  return {
    id: unlayerUserId,
    email: companyEmail,
    name: companyName,
  };
}

// TODO : Export this function to a shared package if needed in other parts of the application (like sm-backbone maybe?).
/**
 * Creates a downloadable object URL for a given File or Blob.
 *
 * This function generates a temporary object URL using the browser's URL API,
 * which can be used to trigger downloads or previews of files (such as exported HTML).
 * If the input is null or an error occurs during URL creation, the function returns undefined.
 *
 * @param {File | Blob | null | undefined} file - The file or blob to generate a URL for.
 * @returns {string | undefined} The generated object URL, or undefined if creation fails or input is null.
 *
 * @example
 * const url = createUrl(blob);
 * if (url) {
 *   const link = document.createElement('a');
 *   link.href = url;
 *   link.download = 'export.html';
 *   link.click();
 * }
 */
export function createDownloadableUrlObject(
  file: File | Blob | null | undefined,
): string | undefined {
  if (!file) {
    console.warn("No file provided to create a downloadable URL.");
    return undefined;
  }

  try {
    const url = (window.URL || window.webkitURL).createObjectURL(file);
    return url;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Failed to create object URL:", err);
      return undefined;
    }
    throw err;
  }
}
