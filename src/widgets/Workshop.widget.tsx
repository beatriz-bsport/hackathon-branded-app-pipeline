import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles } from 'bsport-saas/node_modules/@material-ui/core/styles';
import type {
  Theme,
  WithStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import { ConnectedProps, connect } from 'react-redux';

import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { OwnProps as MarketplaceWorkshopOwnProps } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import type {
  MarketplaceFilters,
  MarketplaceSetFilters,
  MarketplaceWorkshopData,
} from 'bsport-saas/src/libs/marketplace/types';
import type { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import withPostMessageOnPropsUpdate from 'bsport-saas/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from 'bsport-saas/src/hocs/postMessages/with-post-message-to-update-props';
import {
  CalendarFilterValidationSchema,
  CalendarOnlineFilterValidationSchema,
} from 'bsport-saas/src/libs/marketplace/utils';

import '../../vendor/map.css';

import { getEnv } from '../utils/env';
import { bridgeRequestRegisteredOfferIdList } from '../libs/bridge/actions';
import { RootState } from '../reducers';

type MarketplaceWorkshopStyledProps = MarketplaceWorkshopOwnProps & {
  theme: CompanyTheme,
};

const MarketplaceWorkshopBaseStyled = compose<
  MarketplaceWorkshopOwnProps,
  MarketplaceWorkshopStyledProps
>(
  themify,
  withPostMessageOnPropsUpdate([
    { propName: 'filters', messageType: 'bsport:calendar:filter:update' },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:update',
    },
  ]),
  withPostMessageToUpdateProps([
    {
      propName: 'filters',
      messageType: 'bsport:calendar:filter:control',
      validationSchema: CalendarFilterValidationSchema,
    },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:control',
      validationSchema: CalendarOnlineFilterValidationSchema,
    },
  ]),
)(MarketplaceWorkshopBase);

type OwnProps = {
  companyId: number,
  config: MarketplaceWorkshopData,
  store: any,
  theme: CompanyTheme,
  username: string,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps &
  WithStyles<typeof styles> &
  ConnectedProps<typeof connector>;

type State = {
  filters: MarketplaceFilters,
};

class WorkshopWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const filters: MarketplaceFilters = {
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

  setFilters: MarketplaceSetFilters = (key: string) => {
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
        <MarketplaceWorkshopBaseStyled
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

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    fontFamily: theme.typography.fontFamily,
  },
});

const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  bookedOffers: state.bridge.registeredOffers.ids_list,
  username: state.bridge.authentication.username,
});

const mapDispatchToProps = {
  bridgeRequestRegisteredOfferIdList,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, OwnProps>(
  withStyles(styles),
  connector,
)(WorkshopWidget);
