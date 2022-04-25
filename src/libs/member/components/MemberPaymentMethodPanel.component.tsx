import { Button, ButtonBase, Divider, Typography } from '@material-ui/core';
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
import Add from '@material-ui/icons/Add';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import LinkIcon from '@material-ui/icons/Link';
import { OptionCallback } from '../../../state/types';

import { getAddPaymentLink } from '#libs/consumer-space/utils';

type Props = {
  paymentMethod?: Array<any>;
  paymentMethodLoading: boolean;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string, option?: OptionCallback) => void;
  openAddPaymentMethodDialog: (isDialogOpen: boolean) => void;
  snackbarSuccess: (msg: string) => void;
  companyId?: number;
};

export const MemberPaymentMethodPanel = (props: Props) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const { openAddPaymentMethodDialog } = props;

  const openAddPaymentMethodDialogCallback = React.useCallback(() => {
    openAddPaymentMethodDialog && openAddPaymentMethodDialog(true);
  }, [openAddPaymentMethodDialog]);
  const addPaymentLink = React.useMemo(
    () => getAddPaymentLink(props.companyId),
    [props.companyId],
  );
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
      {openAddPaymentMethodDialog && (
        <div className={classes.row}>
          <Button
            color="primary"
            variant="outlined"
            onClick={openAddPaymentMethodDialogCallback}
          >
            <Add color="primary" className={classes.leftIcon} />
            {t('paymentMethod.addPaymentMethod')}
          </Button>
          {props.companyId && (
            <CopyToClipboard text={addPaymentLink}>
              <ButtonBase
                id="button_pass_copy"
                className={classes.link}
                onClick={() =>
                  props.snackbarSuccess && props.snackbarSuccess('link.copied')
                }
              >
                <LinkIcon />
                <Typography className={classes.linkTypo}>
                  {t('paymentMethod.copyLink')}
                </Typography>
              </ButtonBase>
            </CopyToClipboard>
          )}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  link: {
    padding: theme.spacing(1),

    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  row: { display: 'flex', gap: theme.spacing(1), alignItems: 'center' },
  title: {
    paddingBottom: theme.spacing(1),
  },
  flexTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftIcon: { marginRight: theme.spacing(1) },
  linkTypo: {
    paddingLeft: theme.spacing(1),
  },
}));

export default MemberPaymentMethodPanel;
