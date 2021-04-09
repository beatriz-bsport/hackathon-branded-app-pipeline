import { Divider, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

type Props = {
  paymentMethod: ?array<any>,
};

export const MemberPaymentMethodPanel = (props: Props) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  return (
    <div style={{ width: '100%' }}>
      <Typography component="h2" variant="h6" className={classes.title}>
        {t('paymentMethod.title')}
      </Typography>
      <Divider />
      <List>
        {props.paymentMethod && props.paymentMethod.length !== 0 ? (
          props.paymentMethod.map((method) => {
            return (
              <ListItem>
                <ListItemAvatar>
                  {method.type === 'card' ? (
                    <PaymentIcon />
                  ) : (
                    <AccountBalanceIcon />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={`**** **** **** ${method.readable_identifier}`}
                  secondary={method.type === 'card' ? method.brand : null}
                />
              </ListItem>
            );
          })
        ) : (
          <Typography variant="caption" color="textSecondary">
            <p> {t('paymentMethod.none')}</p>
          </Typography>
        )}
      </List>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export default MemberPaymentMethodPanel;
