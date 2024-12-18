import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import Unsubscribe from '#src/libs/consumer-space/components/reworked/@Unsubscribe';
import { RootState } from '../../reducers';

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
  fetchCompanyTheme,
}) => {
  useEffect(() => {
    fetchCompanyTheme(companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Unsubscribe
      companyTheme={companyTheme}
      companyThemeLoading={companyThemeLoading}
      unsubscribe_uuid={unsubscribe_uuid}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  companyTheme: state.theme.theme,
  companyThemeLoading: state.theme.loading,
});

const mapDispatchToProps = { fetchCompanyTheme: fetchCompanyThemeAction };
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
