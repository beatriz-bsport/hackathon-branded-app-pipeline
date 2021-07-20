import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchPrivateServiceBulk } from '../../../libs/private-service/actions';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  privateServiceId: number;
  privateSlotId: number;
  replace: (path: string) => void;
  fetchPrivateServiceBulk: (ids: number[], options: OptionCallback) => void;
};

export class OfferBookerRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateServiceBulk([this.props.privateServiceId], {
      onSuccess: (serviceList: any) => {
        const service = serviceList[0];
        this.props.replace(
          `/checkout/${service.company}/private-slot-booker/${this.props.privateServiceId}/private-slot/${this.props.privateSlotId}/${window.location.search}`,
        );
      },
    });
  }

  render() {
    return <RedirectionLoading />;
  }
}

export default compose(
  routerParamsToProps({
    privateSlotId: 'privateSlotId:number',
    privateServiceId: 'privateServiceId:number',
  }),
  connect(null, {
    replace,
    fetchPrivateServiceBulk,
  }),
)(OfferBookerRedirect);
