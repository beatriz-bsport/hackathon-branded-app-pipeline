import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import WidgetPaymentPackTemplateListPage from 'bsport-saas/src/pages/franchise/payment-pack-template/WidgetPaymentPackTemplateList.page';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import { RootState } from '../reducers';

const WidgetPaymentPackTemplateListPageStyled = themify(
  WidgetPaymentPackTemplateListPage,
);

type OwnProps = {
  title: string,
  store: any,
  theme: Theme,
  franchiseId: number,
};
type State = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class PaymentPackTemplate extends Component<Props, State> {
  render() {
    const { classes, store, theme, franchiseId } = this.props;

    return (
      <div className={classes.container}>
        <WidgetPaymentPackTemplateListPageStyled
          theme={theme}
          store={store}
          franchiseId={franchiseId}
        />
      </div>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    container: {},
  });

const connector = connect((state: RootState) => ({}), {});

export default compose(
  withStyles(styles),
  withTranslation('foo'),
  connector,
)(PaymentPackTemplate);
