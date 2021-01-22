import React, { Component } from 'react';
import { compose } from 'recompose';

import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { MarketplaceWorkshopData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import { openTab } from '../utils/utils';
import { RootState } from '../store/reducer';
import { connect } from 'react-redux';

const MarketplaceWorkshopBaseStyled = themify(MarketplaceWorkshopBase);

type OwnProps = {
  companyId: number;
  config: MarketplaceWorkshopData
  store: any
  theme: Theme
  onWindowOpen: (popupWindow: any) => void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

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

  goToBook = (id: number, companyId: number) => {
    const url = `http://localhost:3000/customer/payment/offer/${id}
    ?membership=${companyId}&authToken=${this.props.auth.token}&context=widget`;
    const popupWindow = openTab(url);
    this.props.onWindowOpen(popupWindow);
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
        }}
      >
        <MarketplaceWorkshopBaseStyled
          companyId={this.props.companyId}
          filters={this.state.filters}
          setFilters={this.setFilters}
          goToBook={this.goToBook}
          store={this.props.store}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

export default compose<any, OwnProps>(
  connect(mapStateToProps, null)
)(WorkshopWidget);
