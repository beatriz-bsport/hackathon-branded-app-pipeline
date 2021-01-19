import React, { Component } from 'react';
import { compose, withProps } from 'recompose';

import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { MarketplaceWorkshopData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import { constants } from '../const/constants';

const MarketplaceWorkshopBaseStyled = themify(MarketplaceWorkshopBase);

type OwnProps = {
  companyId: number;
  config: MarketplaceWorkshopData
  store: any
  theme: Theme
}

type Props = OwnProps & ReturnType<typeof mapWithProps>;

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
    };

    this.state = { filters };
  }

  setFilters = (key: any) => {
    const _this = this;

    return (values: any) => {
      _this.setState((prevState) => ({
        filters: { ...prevState.filters, [key]: values },
      }));
    };
  }

  render() {
    return (
      <div
        style={{
          display: 'flex !important',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <MarketplaceWorkshopBaseStyled
          companyId={this.props.companyId}
          filters={this.state.filters}
          setFilters={this.setFilters}
          goToBook={this.props.goToBook}
          store={this.props.store}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

const mapWithProps = () => ({
  goToBook: (id: number, companyId: number) => {
  window.open(
    `${constants.backofficeUrl}/customer/payment/offer/${id}?membership=${companyId}`
  );
},
});

export default compose<any, OwnProps>(
  withProps(mapWithProps)
)(WorkshopWidget);
