import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchPrivatePassRetrieve } from '../../../libs/private-service/actions';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchPrivatePassBulk: (ids: number[], options: OptionCallback) => void;
};

export class PaymentPackPreCheckoutRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivatePassRetrieve(this.props.id, {
      onSuccess: (privatePass: any) => {
        this.props.replace(
          `/checkout/${privatePass.company}/pre-checkout/private-pass/${privatePass.id}${window.location.search}`,
        );
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
  }),
)(PaymentPackPreCheckoutRedirect);
