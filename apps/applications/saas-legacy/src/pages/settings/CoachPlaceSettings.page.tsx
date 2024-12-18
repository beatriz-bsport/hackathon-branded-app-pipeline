import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import ReplacementRequestConfigurationForm from '#src/libs/replacement-request/components/ReplacementRequestConfigurationForm.component';
import {
  fetchReplacementConfiguration as fetchReplacementConfigurationAction,
  updateReplacementConfiguration as updateReplacementConfigurationAction,
} from '#src/libs/replacement-request/actions';
import { getReplacementRequestConfiguration } from '#src/libs/replacement-request/selectors';
import { UPSELL_IDENTIFIER_SUBTEACHER_TOOL } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { RootState } from '../../reducers';
import { CompanyTheme } from '../../libs/theme/types';
import CoachUserspaceSettingsForm from '../../libs/theme/components/CoachUserspaceSettingsForm.component';
import {
  updateCompanyTheme,
  fetchCompanyTheme as fetchCompanyThemeAction,
} from '../../libs/theme/actions';
import themeSelectors from '../../libs/theme/selectors';

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
        onSubmit={submitTheme}
        setDisplayConfiguration={setDisplayConfiguration}
        theme={theme}
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
