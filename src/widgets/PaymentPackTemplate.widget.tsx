import React, { Component } from 'react';

import { compose } from 'recompose';
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import WidgetPaymentPackTemplateListPage from 'bsport-saas/src/pages/franchise/payment-pack-template/WidgetPaymentPackTemplateList.page';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import { getEnv } from '../utils/env';
import { MarketplacePaymentPackTemplateData } from '../../../bsport-saas/src/libs/marketplace/types';

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
type State = {};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export class PaymentPackTemplate extends Component<Props, State> {
  goToFranchiseSelection = (paymentPackTemplateId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/login?franchisor=${this.props.franchiseId}&franchisorNext=pre-checkout/payment-pack-template/${paymentPackTemplateId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { classes, store, theme, franchiseId } = this.props;
    const params: { paymentPackTemplateList: Array<number> } = {
      paymentPackTemplateList: [],
    };
    if (this.props.config.paymentPackTemplateList?.length > 0) {
      params.paymentPackTemplateList = this.props.config.paymentPackTemplateList;
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

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation('foo'),
)(PaymentPackTemplate);
