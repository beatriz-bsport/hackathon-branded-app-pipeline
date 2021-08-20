// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AlertIcon from '@material-ui/icons/Warning';
import LinkIcon from '@material-ui/icons/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';

import TypographyMultiline from '../../../components/TypographyMultiline.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { PaymentCombo } from '../types';

type Props = {
  paymentCombo: ?PaymentCombo,
  onShopItemClick: (id: number) => void,
  onPaymentPackClick: (id: number) => void,
  onPrivatePassClick: (id: number) => void,
  snackbarSuccess: (string) => void,

  t: TFunction,
  classes: Object,
};

export const PaymentComboCard = (props: Props) => {
  const { t, paymentCombo, classes, snackbarSuccess } = props;

  const renderLinkToPaymentPage = () => {
    return paymentCombo.id ? (
      <CopyToClipboard
        text={`${window.location.origin}/customer/payment/combo/${paymentCombo.id}/?membership=${paymentCombo.company}`}
      >
        <ButtonBase
          className={props.classes.link}
          onClick={() => snackbarSuccess('link.copied')}
        >
          <LinkIcon />
          <Typography className={props.classes.linkTypo}>
            {t('paymentCombo:link.copyLink')}
          </Typography>
        </ButtonBase>
      </CopyToClipboard>
    ) : null;
  };

  if (!paymentCombo) {
    return <LinearProgress />;
  }
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.header}>
          <Typography variant="h4" component="h3">
            {paymentCombo.name}
          </Typography>
          <Typography variant="h4" component="p">
            {`${getCurrencyDisplayWithPrice(paymentCombo.price)}`}
          </Typography>
        </div>
        <Typography
          className={classes.sectionTitle}
          variant="h6"
          component="h4"
          align="right"
        >
          {t('detail.description')}
        </Typography>
        <Paper className={classes.general}>
          <TypographyMultiline>{paymentCombo.description}</TypographyMultiline>{' '}
          {renderLinkToPaymentPage()}
        </Paper>
      </div>
      <div className={classes.comboContentContainer}>
        <div>
          <Typography
            className={classes.contentTitle}
            variant="h6"
            component="h4"
            align="right"
          >
            {t('detail.content')}
          </Typography>
          {paymentCombo.payment_packs.length === 0 &&
          paymentCombo.shop_items.length === 0 &&
          paymentCombo.private_passes.length === 0 ? (
            <div className={classes.emptyContainer}>
              <AlertIcon className={classes.leftIcon} />
              <Typography color="textSecondary">
                {t('detail.emptyContent')}
              </Typography>
            </div>
          ) : (
            <Paper>
              {paymentCombo.payment_packs.map((pp) => (
                <ListItem
                  button
                  onClick={() => props.onPaymentPackClick(pp.id)}
                  key={`pack:${pp.id}`}
                  divider
                >
                  <ListItemIcon>
                    <Avatar className={props.classes.quantity}>
                      {`${pp.quantity}x`}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={pp.name}
                    secondary={`${getCurrencyDisplayWithPrice(pp.price)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => props.onPaymentPackClick(pp.id)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {paymentCombo.shop_items.map((si) => (
                <ListItem
                  onClick={() => props.onShopItemClick(si.id)}
                  button
                  key={`shop_item:${si.id}`}
                  divider
                >
                  <ListItemIcon>
                    <Avatar className={props.classes.quantity}>
                      {`${si.quantity}x`}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={si.name}
                    secondary={`${getCurrencyDisplayWithPrice(si.price)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => props.onShopItemClick(si.id)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {paymentCombo.private_passes.map((pp) => (
                <ListItem
                  button
                  onClick={() => props.onPrivatePassClick(pp.id)}
                  key={`private_pass:${pp.id}`}
                  divider
                >
                  <ListItemIcon>
                    <Avatar className={props.classes.quantity}>
                      {`${pp.quantity}x`}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={pp.name}
                    secondary={`${getCurrencyDisplayWithPrice(pp.price)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => props.onPrivatePassClick(pp.id)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {},
  general: {
    padding: theme.spacing(2),
  },
  contentTitle: {
    paddingBottom: theme.spacing(1),
  },
  sectionTitle: {
    paddingBottom: theme.spacing(1),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  comboContentContainer: {
    paddingTop: theme.spacing(2),
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  quantity: {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
  link: {
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
)(PaymentComboCard);
