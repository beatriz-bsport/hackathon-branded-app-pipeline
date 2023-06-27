import Config from '../../config';
import { SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS } from '#libs/sequential_marketingDEPRECATED/constants';

export const isSequentialMarketingAuthorized = (
  companyId: number,
  hasUpsell: boolean,
) => {
  return (
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS.includes(companyId) ||
    hasUpsell
  );
};
