import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';

import { MarketplaceWorkshopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { MarketplaceWorkshopData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import '../../vendor/map.css';
import { getEnv } from '../utils/env';

const MarketplaceWorkshopBaseStyled = themify(MarketplaceWorkshopBase);

type OwnProps = {
  companyId: number,
  config: MarketplaceWorkshopData,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

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

export default compose<any, OwnProps>(withStyles(styles))(WorkshopWidget);
