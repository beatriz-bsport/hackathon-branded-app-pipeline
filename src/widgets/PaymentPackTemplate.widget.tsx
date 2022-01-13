import React, { Component } from 'react';

import { compose } from 'recompose';
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import WidgetPaymentPackTemplateListPage from 'bsport-saas/src/pages/franchise/payment-pack-template/WidgetPaymentPackTemplateList.page';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import { MarketplacePaymentPackTemplateData } from '../../../bsport-saas/src/libs/marketplace/types';
import { buildFranchiseSelectionThenCheckoutUrl } from './utils';

const WidgetPaymentPackTemplateListPageStyled = themify(
  WidgetPaymentPackTemplateListPage,
);

type OwnProps = {
  config?: MarketplacePaymentPackTemplateData,
  title: string,
  store: any,
  theme: Theme,
  franchiseId: number,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps & WithStyles<typeof styles>;

export class PaymentPackTemplate extends Component<Props> {
  goToFranchiseSelection = (paymentPackTemplateId: number) => {
    const url = buildFranchiseSelectionThenCheckoutUrl(
      this.props.franchiseId,
      paymentPackTemplateId,
    );

    url && this.props.onWindowOpen(url);
  };

  render() {
    const { classes, store, theme, franchiseId } = this.props;
    const params: { paymentPackTemplateList: Array<number> } = {
      paymentPackTemplateList: [],
    };
    if (this.props.config?.paymentPackTemplateList?.length > 0) {
      params.paymentPackTemplateList = this.props.config?.paymentPackTemplateList;
    }
    return (
      <div className={classes.container}>
        <WidgetPaymentPackTemplateListPageStyled
          theme={theme}
          store={store}
          franchiseId={franchiseId}
          goToFranchiseSelection={this.goToFranchiseSelection}
          params={params}
        />
      </div>
    );
  }
}

const styles = () =>
  createStyles({
    container: {
      width: '100%',
    },
  });

export default compose<any, OwnProps>(withStyles(styles))(PaymentPackTemplate);
