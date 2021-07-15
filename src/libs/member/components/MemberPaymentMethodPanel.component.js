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
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

type Props = {
  paymentMethod: ?array<any>,
  paymentMethodLoading: boolean,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
};

export const MemberPaymentMethodPanel = (props: Props) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  return (
    <div style={{ width: '100%' }}>
      <div className={classes.flexTitle}>
        <Typography component="h2" variant="h6" className={classes.title}>
          {t('paymentMethod.title')}
        </Typography>
        {props.detachPaymentMethodLoading && (
          <CircularProgress size="1.5rem" color="secondary" />
        )}
      </div>
      {props.paymentMethodLoading && <LinearProgress />}
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
                  secondary={`${method.type === 'card' ? method.brand : ''}   ${
                    method.additional_info
                  }`}
                />

                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    disabled={props.detachPaymentMethodLoading}
                  >
                    <DeleteIcon
                      onClick={() => props.detachPaymentMethod(method.id)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
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
  flexTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default MemberPaymentMethodPanel;
