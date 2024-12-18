import React from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Button,
  ButtonBase,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  CircularProgress,
  LinearProgress,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import LinkIcon from '@material-ui/icons/Link';

import type { OptionCallback } from '#src/state/types';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import { getAddPaymentLink } from '#src/libs/consumer-space/utils';
import { getPaymentMethodBrandName } from '#src/libs/payment/utils';

type Props = {
  paymentMethod?: Array<any>;
  paymentMethodLoading: boolean;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (
    pm_id: string,
    option?: OptionCallback<unknown, number>,
  ) => void;
  openAddPaymentMethodDialog: (isDialogOpen: boolean) => void;
  snackbarSuccess: (msg: string) => void;
  companyId?: number;
};

export const MemberPaymentMethodPanel = (props: Props) => {
  const { t } = useTranslation('invoice');
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
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'billing.allowed_actions.addPaymentMethod',
        'billing.allowed_actions.deletePaymentMethod',
      ]}
    >
      {([
        hasAddPaymentMethodPermission,
        hasDeletePaymentMethodPermission,
      ]: boolean[]) => (
        <div style={{ width: '100%' }}>
          <div className={classes.flexTitle}>
            <Typography className={classes.title} component="h2" variant="h6">
              {t('paymentMethod.title')}
            </Typography>
            {props.detachPaymentMethodLoading && (
              <CircularProgress color="secondary" size="1.5rem" />
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
                      secondary={`${
                        method.type === 'card'
                          ? getPaymentMethodBrandName(
                              method.display_brand ?? method.brand,
                              t('paymentMethod.other'),
                            )
                          : ''
                      }   ${method.additional_info}`}
                    />

                    {hasDeletePaymentMethodPermission && (
                      <ListItemSecondaryAction>
                        <IconButton
                          aria-label="delete"
                          disabled={props.detachPaymentMethodLoading}
                          edge="end"
                        >
                          <DeleteIcon
                            onClick={() => props.detachPaymentMethod(method.id)}
                          />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                );
              })
            ) : (
              <Typography color="textSecondary" variant="caption">
                <p> {t('paymentMethod.none')}</p>
              </Typography>
            )}
          </List>
          {hasAddPaymentMethodPermission && openAddPaymentMethodDialog && (
            <div className={classes.row}>
              <Button
                color="primary"
                onClick={openAddPaymentMethodDialogCallback}
                variant="outlined"
              >
                <Add className={classes.leftIcon} color="primary" />
                {t('paymentMethod.addPaymentMethod')}
              </Button>
              {props.companyId && (
                <CopyToClipboard text={addPaymentLink}>
                  <ButtonBase
                    className={classes.link}
                    id="button_pass_copy"
                    onClick={() =>
                      props.snackbarSuccess &&
                      props.snackbarSuccess('link.copied')
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
      )}
    </ObjectLevelPermissionProvider>
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
