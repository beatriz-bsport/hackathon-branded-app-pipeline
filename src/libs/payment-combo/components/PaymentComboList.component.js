// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import { withTranslation, TFunction } from 'react-i18next';

import { Divider } from '@material-ui/core';
import PaymentComboListItem from './PaymentComboListItem.component';

type Props = {
  t: TFunction,
  classes: Object,

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
          <Divider className={props.classes.divider} />
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
          <Divider className={props.classes.divider} />
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
    </Grid>
  );
};

const styles = (theme) => ({
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  explainIfEmpty: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    color: 'bleu',
    fontSize: 'larger',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    border: '2px solid #E2E2E2',
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    width: '400px',
    marginLeft: '200px',
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
)(PaymentComboList);
