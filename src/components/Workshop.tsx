import React, { Component } from 'react';
import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { compose, withProps } from 'recompose';
import { constants } from '../const/constants';

type OwnProps = {
  companyId: string;
  defaultFilters: any;
  store: any
}

type Props = OwnProps & ReturnType<typeof mapWithProps>;

type State = {
  filters: any,
};

class WorkshopWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const filters: any = props.defaultFilters || {};
    if (filters.metaActivities) {
      filters.activity__in = filters.metaActivities;
    }

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
        <MarketplaceWorkshopBase
          companyId={parseInt(this.props.companyId)}
          filters={this.state.filters}
          setFilters={this.setFilters}
          goToBook={this.props.goToBook}
          store={this.props.store}
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

export default compose(
  withProps(mapWithProps)
)(WorkshopWidget);
