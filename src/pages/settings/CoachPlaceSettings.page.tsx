import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import { RootState } from '../../reducers';
import { CompanyTheme } from '../../libs/theme/types';
import CoachUserspaceSettingsForm from '../../libs/theme/components/CoachUserspaceSettingsForm.component';
import ReplacementRequestConfigurationForm from '#libs/replacement-request/components/ReplacementRequestConfigurationForm.component';
import {
  updateCompanyTheme,
  fetchCompanyTheme as fetchCompanyThemeAction,
} from '../../libs/theme/actions';
import {
  fetchReplacementConfiguration as fetchReplacementConfigurationAction,
  updateReplacementConfiguration as updateReplacementConfigurationAction,
} from '#libs/replacement-request/actions';
import { getReplacementRequestConfiguration } from '#libs/replacement-request/selectors';
import themeSelectors from '../../libs/theme/selectors';
import { UPSELL_IDENTIFIER_SUBTEACHER_TOOL } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

type OwnProps = {
  theme: CompanyTheme;
  loading: boolean;
  submitTheme: (companyId: number, data: any) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export const CoachPlaceSettings: React.FC<Props> = ({
  theme,
  loading,
  submitTheme,
  configuration,
  configurationLoading,
  featureList,
  fetchCompanyTheme,
  fetchReplacementConfiguration,
  updateReplacementConfiguration,
}) => {
  const [displayConfigurationForm, setDisplayConfiguration] = useState(false);

  useEffect(() => {
    fetchCompanyTheme();
    if (hasUpsell(featureList, UPSELL_IDENTIFIER_SUBTEACHER_TOOL)) {
      fetchReplacementConfiguration();
    }
  }, [fetchCompanyTheme, fetchReplacementConfiguration, featureList]);

  if (loading || configurationLoading) return <LinearProgress />;

  return (
    <div>
      <CoachUserspaceSettingsForm
        theme={theme}
        onSubmit={submitTheme}
        setDisplayConfiguration={setDisplayConfiguration}
      />

      {hasUpsell(featureList, UPSELL_IDENTIFIER_SUBTEACHER_TOOL) &&
        displayConfigurationForm &&
        configuration && (
          <ReplacementRequestConfigurationForm
            configuration={configuration}
            onSubmit={updateReplacementConfiguration}
          />
        )}
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    theme: themeSelectors.getTheme(state),
    configuration: getReplacementRequestConfiguration(state),
    loading: state.theme.loading,
    processing: state.theme.createOrUpdate.loading,
    configurationLoading: state.replacementRequest.configuration.loading,
    featureList: state.company.feature.data,
  }),
  {
    fetchCompanyTheme: fetchCompanyThemeAction,
    submitTheme: updateCompanyTheme,
    fetchReplacementConfiguration: fetchReplacementConfigurationAction,
    updateReplacementConfiguration: updateReplacementConfigurationAction,
  },
);

export default connector(CoachPlaceSettings);
