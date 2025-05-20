import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';

import {
  fetchMyFranchiseMarketingPreferences as fetchMyFranchiseMarketingPreferencesAction,
  updateMyFranchiseMarketingPreferences as updateMyFranchiseMarketingPreferencesAction,
  checkFranchiseMarketingPreferencesEligibility as checkFranchiseMarketingPreferencesEligibilityAction,
} from '#src/libs/consumer-space/actions/marketing-preferences';
import {
  getFranchiseMarketingPreferencesEligiblity,
  getFranchiseMarketingPreferences,
  getFranchiseMarketingPreferencesUpdateState,
} from '#src/libs/consumer-space/selectors';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import Unsubscribe from '#src/libs/consumer-space/components/reworked/@Unsubscribe';
import type { CompanyTheme } from '#src/libs/theme/types';
import { RootState } from '../../reducers';
import type { MarketingPreferenceUpdatePayload } from '#src/libs/communication/types';
import UnsubscribeFranchiseMarketingPreferences from '#src/libs/consumer-space/components/reworked/@Unsubscribe/UnsubscribeFranchiseMarketingPreferences.component';

type ReturnTypeRouterParamasToProps = {
  unsubscribe_uuid: string;
  companyId: number;
};

type Props = ReturnTypeRouterParamasToProps & ConnectedProps<typeof connector>;

export const ConsumerUnsubscriber: React.FC<Props> = ({
  unsubscribe_uuid,
  companyId,
  companyThemeLoading,
  companyTheme,
  isFranchiseMarketingPreferencesActivated,
  isFranchiseMarketingPreferencesActivatedLoading,
  franchiseMarketingPreferences,
  fetchCompanyTheme,
  checkFranchiseMarketingPreferencesEligibility,
  fetchMyFranchiseMarketingPreferences,
  updateMyFranchiseMarketingPreferences,
}) => {
  const handleSubmitMyFranchiseMarketingPreferences = React.useCallback(
    (data: MarketingPreferenceUpdatePayload[]) =>
      !!companyTheme?.franchisor &&
      updateMyFranchiseMarketingPreferences({
        franchise_id: companyTheme.franchisor,
        data,
        unsubscribe_uuid,
      }),
    [updateMyFranchiseMarketingPreferences, companyTheme, unsubscribe_uuid],
  );
  useEffect(() => {
    fetchCompanyTheme(companyId, {
      onSuccess: (_companyTheme: CompanyTheme) => {
        if (!!_companyTheme.franchisor) {
          checkFranchiseMarketingPreferencesEligibility(
            {
              franchise_id: _companyTheme.franchisor,
              unsubscribe_uuid,
            },
            {
              onSuccess: () =>
                fetchMyFranchiseMarketingPreferences({
                  franchise_id: _companyTheme.franchisor,
                  unsubscribe_uuid,
                }),
            },
          );
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (companyThemeLoading || isFranchiseMarketingPreferencesActivatedLoading) {
    return null;
  }
  if (!isFranchiseMarketingPreferencesActivated) {
    return (
      <Unsubscribe
        companyTheme={companyTheme}
        companyThemeLoading={companyThemeLoading}
        unsubscribe_uuid={unsubscribe_uuid}
      />
    );
  }
  if (!!franchiseMarketingPreferences?.length) {
    return (
      <UnsubscribeFranchiseMarketingPreferences
        onSubmit={handleSubmitMyFranchiseMarketingPreferences}
        preferences={franchiseMarketingPreferences}
      />
    );
  }
  return null;
};

const mapStateToProps = (state: RootState) => ({
  companyTheme: state.theme.theme,
  companyThemeLoading: state.theme.loading,
  isFranchiseMarketingPreferencesActivated:
    getFranchiseMarketingPreferencesEligiblity(state),
  isFranchiseMarketingPreferencesActivatedLoading:
    state.consumerReworked.myFranchiseMarketingPreferences.eligibility.loading,
  franchiseMarketingPreferences: getFranchiseMarketingPreferences(state),
  franchiseMarketingPreferencesUpdateState:
    getFranchiseMarketingPreferencesUpdateState(state),
});

const mapDispatchToProps = {
  fetchCompanyTheme: fetchCompanyThemeAction,
  // MARKETING PREFERENCES
  fetchMyFranchiseMarketingPreferences:
    fetchMyFranchiseMarketingPreferencesAction,
  updateMyFranchiseMarketingPreferences:
    updateMyFranchiseMarketingPreferencesAction,
  checkFranchiseMarketingPreferencesEligibility:
    checkFranchiseMarketingPreferencesEligibilityAction,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, {}>(
  routerParamsToProps({
    unsubscribe_uuid: 'unsubscribe_uuid:string',
    companyId: 'companyId:number',
  }),
  connector,
  React.memo,
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerUnsubscriber);
