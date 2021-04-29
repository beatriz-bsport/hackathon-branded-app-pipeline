import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { MarketplaceWorkshopData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import { RootState } from '../store/reducer';
import '../../vendor/map.css';

const MarketplaceWorkshopBaseStyled = themify(MarketplaceWorkshopBase);

type OwnProps = {
  companyId: number,
  config: MarketplaceWorkshopData,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
  dialogMode: number,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  MaterialStyleType<ReturnType<typeof styles>>;

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
  };

  goToBook = (id: number, companyId: number) => {
    const { PUBLIC_URL } = window.runtime.env;
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <MarketplaceWorkshopBaseStyled
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

const styles = () => ({
  container: {
    width: '100%',
  },
});

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(mapStateToProps, null)
)(WorkshopWidget);
