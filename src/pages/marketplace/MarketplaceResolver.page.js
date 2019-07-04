// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import api from '../../api';

type Props = {
  companyName: string,
  goToMarketplace: (name: string, id: number) => void,
};

export class MarketplaceResolver extends Component<Props> {
  resolveMarketplaceURL = () => {
    api.marketplace
      .getIdByName(this.props.companyName)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res);
        }
        const companyId = res.data;
        this.props.goToMarketplace(this.props.companyName, companyId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    this.resolveMarketplaceURL();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyName !== this.props.companyName) {
      this.resolveMarketplaceURL();
    }
  }

  render() {
    return <LinearProgress />;
  }
}

export default compose(
  routerParamsToProps({ companyName: 'companyName' }),
  connect(
    null,
    {
      goToMarketplace: (name, id) => push(`/m/${name}/${id}/`),
    },
  ),
)(MarketplaceResolver);
