import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

import type { UpsellSumup } from '#src/libs/company/types';
import { hasUpsellIdentifier } from '#src/libs/role/utils';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';

/**
 * Checks whether the report should be displayed based on the upsells the studio has.
 * No checks are permormed for the Master Account.
 * @param reportCategory the category of the report.
 * @param subscribedUpsells the upsells the user has.
 * @returns true if the report should be displayed, false otherwise.
 */
export const filter_reports_by_upsells = (
  reportCategory: ReportCategoryEnum,
  subscribedUpsells: UpsellSumup[],
) => {
  switch (reportCategory) {
    case ReportCategoryEnum.ACCESS_MONITORING:
      return (
        hasUpsellIdentifier(
          UPSELL_IDENTIFIER_ACCESS_MONITORING,
          subscribedUpsells,
          true,
        ) ||
        hasUpsellIdentifier(
          UPSELL_IDENTIFIER_KISI_INTEGRATION,
          subscribedUpsells,
          true,
        )
      );

    default:
      return true;
  }
};
