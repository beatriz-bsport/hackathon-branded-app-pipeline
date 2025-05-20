import React from 'react';
import Typography from '#Fabrique/Typography';
import { useTranslation } from 'react-i18next';
import FranchiseMarketingPreferences from '#src/components/css-only/Portals/FranchiseMarketingPreferencesPortal/FranchiseMarketingPreferences.component';
import type { MarketingPreferenceData } from '#src/libs/communication/types';
import type { OptionCallback } from '#src/state/types';
import './styles.css';
type FormValues = MarketingPreferenceData[];
interface FranchiseMarketingPreferencesProps {
  preferences: MarketingPreferenceData[];
  onSubmit: (
    preferences: MarketingPreferenceData[],
    option?: OptionCallback,
  ) => void;
}

const UnsubscribeFranchiseMarketingPreferences: React.FC<
  FranchiseMarketingPreferencesProps
> = ({ preferences, onSubmit }) => {
  const { t } = useTranslation('consumerSpace');

  // Handle form submission
  const _handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  return (
    <div className="bs-unsubscribe-marketing-prefs__container">
      <Typography
        className="bs-unsubscribe-marketing-prefs__title"
        variant="title-sm"
      >
        {t('consumerSpace:reworked.myProfile.notifications.portal.title')}
      </Typography>
      <Typography
        className="bs-unsubscribe-marketing-prefs__subtitle"
        variant="body-md"
      >
        {t('consumerSpace:reworked.myProfile.notifications.portal.subtitle')}
      </Typography>
      <FranchiseMarketingPreferences
        onSubmit={_handleSubmit}
        preferences={preferences}
      />
    </div>
  );
};

export default React.memo(UnsubscribeFranchiseMarketingPreferences);
