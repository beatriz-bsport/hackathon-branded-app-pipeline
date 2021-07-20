import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchOfferBulk } from '../../../libs/offer/actions';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchOfferBulk: (ids: number[], options: OptionCallback) => void;
};

export class OfferBookerRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchOfferBulk([this.props.id], {
      onSuccess: (offerList: any) => {
        const offer = offerList[0];
        this.props.replace(
          `/checkout/${offer.company}/offer-booker/${offer.id}${window.location.search}`,
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
    fetchOfferBulk,
  }),
)(OfferBookerRedirect);
