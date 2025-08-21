import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchPrivatePassRetrieve } from '../../../libs/private-service/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import type { OptionCallback } from '#src/state/types';
import { PrivatePass } from '#src/libs/private-service/types';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchCompanyTheme: (companyId: number, options: OptionCallback) => void;
  fetchPrivatePassRetrieve: (
    id: number,
    options?: OptionCallback<PrivatePass> | undefined,
  ) => void;
};

export class PaymentPackPreCheckoutRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivatePassRetrieve(this.props.id, {
      onSuccess: (privatePass: any) => {
        this.props.fetchCompanyTheme(privatePass.company, {
          onSuccess: () => {
            this.props.replace(
              `/checkout/${privatePass.company}/pre-checkout/private-pass/${privatePass.id}${window.location.search}`,
            );
          },
          onError: () => {
            this.props.replace(
              `/checkout/${privatePass.company}/pre-checkout/private-pass/${privatePass.id}${window.location.search}`,
            );
          },
        });
      },
    });
  }

  render() {
    return <RedirectionLoading />;
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(null, {
    replace,
    fetchPrivatePassRetrieve,
    fetchCompanyTheme: fetchCompanyThemeAction,
  }),
)(PaymentPackPreCheckoutRedirect);
