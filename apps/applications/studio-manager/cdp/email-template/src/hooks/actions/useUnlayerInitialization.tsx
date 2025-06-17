import { useEffect, useState } from "react";
import { UnlayerOptions } from "react-email-editor";

import { getEnv } from "@bsport/envs";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CompanyTypeEnum } from "#src/utils/constants";
import {
  getDevelopmentUnlayerUser,
  getProductionUnlayerUser,
} from "#src/utils/emailEditor";
import { LANGUAGES, i18nInstance } from "#src/utils/i18n";

export const useUnlayerInitialization = () => {
  /**
   * Represents a user in the Unlayer system.
   *
   * An Unlayer user is composed of three keys:
   * - **ID**: The most important key, which should always be unique (especially in production).
   *   - *Development environment*: Formatted as `${currentEnv}-${companyType}-test-${isStudioIdOdd}`.
   *     - Example: `"local-company-test-odd"` for a local company with an odd companyId.
   *     - In development, uniqueness is not enforced to allow content sharing among certain users, but IDs are separated per environment.
   *   - *Production environment*: Formatted as `${companyType}-${companyId}`.
   *     - Example: `"company-2"`.
   *     - In production, IDs must be completely unique to ensure no data is shared between users. The companyId ensures uniqueness, and companyType prevents overlap (e.g., a franchise and a company can have the same numeric ID but are distinct).
   * - **Email**: The email address the user used to log into bsport.
   * - **Name**: The name of the company.
   *
   * @typedef {Object} UnlayerUser
   * @property {string} id - Unique identifier for the user (see format rules above).
   * @property {string} email - The user's login email.
   * @property {string} name - The name of the company.
   */
  const [unlayerUserId, setUnlayerUserId] =
    useState<UnlayerOptions["user"]>(undefined);
  const authenticatedUser = dataAccessLayer.useUserAccess();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyName = companyTheme && companyTheme?.company_name;
  const companyId = companyTheme && companyTheme?.id;
  const companyEmail = authenticatedUser && authenticatedUser?.username;
  const currentEnv = getEnv();
  const currentLocale = i18nInstance.language ?? LANGUAGES.ENGLISH_US;

  useEffect(() => {
    if (
      currentEnv === "production" &&
      companyId &&
      companyEmail &&
      companyName
    ) {
      setUnlayerUserId(
        getProductionUnlayerUser({
          companyEmail: companyEmail,
          companyName: companyName,
          companyId,
          companyType: CompanyTypeEnum.COMPANY,
        }),
      );
    } else if (currentEnv !== "production" && companyId && companyTheme) {
      setUnlayerUserId(
        getDevelopmentUnlayerUser({
          currentEnv,
          companyId,
          companyType: CompanyTypeEnum.COMPANY,
        }),
      );
    }
  }, [companyEmail, companyId, companyName, currentEnv, companyTheme]);

  return {
    unlayerUserId,
    currentLocale,
    companyName,
  };
};
