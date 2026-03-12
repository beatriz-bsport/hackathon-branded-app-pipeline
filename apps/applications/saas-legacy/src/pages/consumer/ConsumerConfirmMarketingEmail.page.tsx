import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import ConfirmMarketingEmail from '#src/libs/consumer-space/components/reworked/@ConfirmMarketingEmail';
import { RootState } from '../../reducers';

type ReturnTypeRouterParamsToProps = {
  memberId: number;
  confirmationToken: string;
  companyId: number;
};

type Props = ReturnTypeRouterParamsToProps & ConnectedProps<typeof connector>;

export const ConsumerConfirmMarketingEmail: React.FC<Props> = ({
  companyId,
  memberId,
  confirmationToken,
  companyTheme,
  companyThemeLoading,
  fetchCompanyTheme,
}) => {
  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [companyId, fetchCompanyTheme]);

  return (
    <ConfirmMarketingEmail
      companyTheme={companyTheme}
      companyThemeLoading={companyThemeLoading}
      confirmationToken={confirmationToken}
      memberId={memberId}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  companyTheme: state.theme.theme,
  companyThemeLoading: state.theme.loading,
});

const mapDispatchToProps = {
  fetchCompanyTheme: fetchCompanyThemeAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, {}>(
  routerParamsToProps({
    confirmationToken: 'confirmationToken:string',
    companyId: 'companyId:number',
    memberId: 'memberId:number',
  }),
  connector,
  React.memo,
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerConfirmMarketingEmail);
