// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PaymentComboListItem from './PaymentComboListItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  loading: boolean,

  paymentComboListAvailableOnline: Array<PaymentCombo>,
  paymentComboListUnavailableOnline: Array<PaymentCombo>,

  onClickPaymentCombo: (id: number) => void,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
};

export const PaymentComboList = (props: Props) => {
  return (
    <Grid container direction="row" spacing={2}>
      {props.paymentComboListAvailableOnline.length ? (
        <Grid item xs={12} md={6}>
          <Typography variant="h5" className={props.classes.sectionTitle}>
            {props.t('list.section.availableOnline')}
          </Typography>
          <Paper>
            <List disablePadding>
              {props.paymentComboListAvailableOnline.map((pc) => (
                <PaymentComboListItem
                  divider
                  paymentCombo={pc}
                  onEdit={() => props.onEdit(pc)}
                  onDelete={() => props.onDelete(pc.id)}
                  key={pc.id}
                  onClick={() => props.onClickPaymentCombo(pc.id)}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      ) : null}
      {props.paymentComboListUnavailableOnline.length ? (
        <Grid item xs={12} md={6}>
          <Typography variant="h5" className={props.classes.sectionTitle}>
            {props.t('list.section.unavailableOnline')}
          </Typography>
          <Paper>
            <List disablePadding>
              {props.paymentComboListUnavailableOnline.map((pc) => (
                <PaymentComboListItem
                  onEdit={() => props.onEdit(pc)}
                  onDelete={() => props.onDelete(pc.id)}
                  onClick={() => props.onClickPaymentCombo(pc.id)}
                  divider
                  paymentCombo={pc}
                  key={pc.id}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      ) : null}
      {props.paymentComboListUnavailableOnline.length === 0 &&
      props.paymentComboListAvailableOnline.length === 0 &&
      !props.loading ? (
        <Grid item xs={12}>
          <Typography
            className={props.classes.explainIfEmpty}
            color="textSecondary"
            align="center"
          >
            {props.t('list.explainIfEmpty')}
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

const styles = (theme) => ({
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  explainIfEmpty: {
    paddingTop: theme.spacing(5),
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
)(PaymentComboList);
