import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withState } from 'recompose';

import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { List, Paper, Typography, Dialog } from '@material-ui/core';
import { retrieveFranchise as retrieveFranchiseAction } from '#src/libs/franchise/actions';
import { getPaymentPackTemplateListAvailable } from '#src/libs/payment-packs/selectors';
import MarketplacePaymentPackTemplateListItem from '#src/libs/payment-packs/components/MarketplacePaymentPackTemplateListItem';

import PaymentPackTemplateCard from '#src/libs/payment-packs/components/PaymentPackTemplateCard.component';
import { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '../../../libs/payment-packs/actions';
import { RootState } from '../../../reducers';

type OwnProps = {
  title: string;
  franchiseId: number;
  paymentPackTemplateDetailed: PaymentPackTemplate;
  setPaymentPackTemplateDetailed: (arg: PaymentPackTemplate) => void;
  goToFranchiseSelection?: (
    paymentPackTemplateId: number,
    companies: Array<number>,
  ) => void;
  params?: { paymentPackTemplateList: Array<number> };
};
type State = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class PaymentPackTemplateList extends Component<Props, State> {
  componentDidMount() {
    this.props.retrieveFranchise(this.props.franchiseId);
    this.props.fetchPaymentPackTemplateList({
      franchisor: this.props.franchiseId,
      id__in: this.props.params.paymentPackTemplateList,
    });
  }

  render() {
    const {
      classes,
      t,
      paymentPackTemplateListAvailable,
      paymentPackTemplateDetailed,
      setPaymentPackTemplateDetailed,
      goToFranchiseSelection,
    } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="h6">{t('paymentPackTemplate.pass')}</Typography>
        <Paper>
          <List dense disablePadding>
            {paymentPackTemplateListAvailable?.map((ppt) => (
              <MarketplacePaymentPackTemplateListItem
                key={ppt.id}
                buyPaymentPackTemplateInstance={() => {
                  goToFranchiseSelection(
                    ppt.id,
                    ppt.companies?.map((company) => company.id),
                  );
                }}
                onSelect={() => setPaymentPackTemplateDetailed(ppt)}
                paymentPackTemplate={ppt}
              />
            ))}
          </List>
        </Paper>
        <Dialog
          onClose={() => setPaymentPackTemplateDetailed(null)}
          open={!!paymentPackTemplateDetailed}
        >
          <PaymentPackTemplateCard
            buyPaymentPackTemplateInstance={() => {
              goToFranchiseSelection(
                paymentPackTemplateDetailed.id,
                paymentPackTemplateDetailed.companies?.map(
                  (company) => company.id,
                ),
              );
              setPaymentPackTemplateDetailed(null);
            }}
            paymentPackTemplate={paymentPackTemplateDetailed}
          />
        </Dialog>
      </div>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
  });

const connector = connect(
  (state: RootState) => ({
    paymentPackTemplateListAvailable:
      getPaymentPackTemplateListAvailable(state),
  }),
  {
    fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
    retrieveFranchise: retrieveFranchiseAction,
  },
);

export default compose(
  withState(
    'paymentPackTemplateDetailed',
    'setPaymentPackTemplateDetailed',
    null,
  ),
  withStyles(styles),
  withTranslation(['paymentPack']),
  connector,
)(PaymentPackTemplateList);
