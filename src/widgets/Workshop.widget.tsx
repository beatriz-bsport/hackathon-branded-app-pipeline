import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';

import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { MarketplaceWorkshopData } from 'bsport-saas/src/libs/marketplace/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import '../../vendor/map.css';
import { getEnv } from '../utils/env';
import {
  bridgeRequestRegisteredOfferIdList,
  bridgeRequestAuthenticationStatus,
} from '../libs/bridge/actions';
import { RootState } from '../reducers';

type OwnProps = {
  companyId: number,
  config: MarketplaceWorkshopData,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type State = {
  filters: any,
};

class WorkshopWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const filters: any = {
      coaches: props.config.coaches || [],
      establishments: props.config.establishments || [],
      activity__in: props.config.metaActivities || [],
      levels: props.config.levels || [],
      establishment_group__in: props.config.establishmentGroups || [],
    };

    this.state = { filters };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.bridgeRequestRegisteredOfferIdList();
    }
  }

  setFilters = (key: any) => {
    const _this = this;

    return (values: any) => {
      _this.setState((prevState) => ({
        filters: { ...prevState.filters, [key]: values },
      }));
    };
  };

  goToBook = (id: number, companyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <MarketplaceWorkshopBase
          {...this.props}
          companyId={this.props.companyId}
          filters={this.state.filters}
          setFilters={this.setFilters}
          goToBook={this.goToBook}
          store={this.props.store}
          theme={this.props.theme}
          mapContainerClassName="cleanslate"
        />
      </div>
    );
  }
}

const styles = (theme: MuiTheme) => ({
  container: {
    width: '100%',
    fontFamily: theme.typography.fontFamily,
  },
});

const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  bookedOffers: state.bridge.registeredOffers.ids_list,
});

const mapDispatchToProps = {
  bridgeRequestAuthenticationStatus,
  bridgeRequestRegisteredOfferIdList,
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(WorkshopWidget);
