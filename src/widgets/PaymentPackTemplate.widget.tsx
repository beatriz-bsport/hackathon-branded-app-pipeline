import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import WidgetPaymentPackTemplateListPage from 'bsport-saas/src/pages/franchise/payment-pack-template/WidgetPaymentPackTemplateList.page';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import { RootState } from '../reducers';
import { getEnv } from '../utils/env';

const WidgetPaymentPackTemplateListPageStyled = themify(
  WidgetPaymentPackTemplateListPage,
);

type OwnProps = {
  title: string,
  store: any,
  theme: Theme,
  franchiseId: number,
  onWindowOpen: (url: string) => void,
};
type State = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class PaymentPackTemplate extends Component<Props, State> {
  goToFranchiseSelection = (paymentPackTemplateId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/login?franchisor=${this.props.franchiseId}&franchisorNext=/c/checkout/pre-checkout/payment-pack-template/${paymentPackTemplateId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { classes, store, theme, franchiseId } = this.props;

    return (
      <div className={classes.container}>
        <WidgetPaymentPackTemplateListPageStyled
          theme={theme}
          store={store}
          franchiseId={franchiseId}
          goToFranchiseSelection={this.goToFranchiseSelection}
        />
      </div>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
    },
  });

const connector = connect((state: RootState) => ({}), {});

export default compose(
  withStyles(styles),
  withTranslation('foo'),
  connector,
)(PaymentPackTemplate);
