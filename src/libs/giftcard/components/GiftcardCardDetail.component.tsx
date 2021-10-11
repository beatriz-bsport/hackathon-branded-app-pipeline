import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import TodayIcon from '@material-ui/icons/Today';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import TypographyMultiline from '../../../components/TypographyMultiline.component';
import AvailablePaymentMethodList from '../../payment/components/AvailablePaymentMethodList.component';
import { Giftcard } from '../types';

type Props = {
  giftcard: Giftcard;
  noCover?: boolean;
  snackbarSuccess: (msg: string) => void;
};

const GiftcardCardDetail = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  const { giftcard } = props;
  return (
    <div className={classes.container}>
      {giftcard.cover && !props.noCover ? (
        <img
          alt={giftcard.name}
          className={classes.cover}
          src={giftcard.cover}
        />
      ) : null}
      <Paper className={classes.paperContainer}>
        <div className={classes.titleRow}>
          <Typography variant="h4">{giftcard.name}</Typography>
          <Typography color="primary" variant="h5">
            {getCurrencyDisplayWithPrice(giftcard.price)}
          </Typography>
        </div>
        <CopyToClipboard
          text={`${window.location.origin}/customer/payment/giftcard/${giftcard.id}/?membership=${giftcard.company}&force=true`}
        >
          <ButtonBase
            id="button_pass_copy"
            className={classes.link}
            onClick={() =>
              props.snackbarSuccess && props.snackbarSuccess('link.copied')
            }
          >
            <LinkIcon />
            <Typography className={classes.linkTypo}>
              {t('link.copyLink')}
            </Typography>
          </ButtonBase>
        </CopyToClipboard>
        <div className={classes.descriptionContainer}>
          <TypographyMultiline color="textSecondary">
            {giftcard.description}
          </TypographyMultiline>
        </div>
        {!!giftcard.expiration_days && (
          <div className={classes.row}>
            <TodayIcon className={classes.iconLeft} />
            <Typography variant="body2">
              {t('giftcard.detail.expirationDate', {
                expiration_days: giftcard.expiration_days,
              })}
            </Typography>
          </div>
        )}
        {giftcard.manager_only && (
          <div className={classes.row}>
            <VisibilityOffIcon className={classes.iconLeft} />
            <Typography variant="body2">
              {t('giftcard.detail.manager_only')}
            </Typography>
          </div>
        )}
        <div className={classes.paymentMethodContainer}>
          <Typography variant="body2" color="textSecondary">
            {t('giftcard.detail.availablePaymentMethods')}
          </Typography>
          <AvailablePaymentMethodList
            available_payment_method_identifiers={
              giftcard.available_payment_method_identifiers
            }
          />
        </div>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  paperContainer: {
    padding: theme.spacing(3),
    width: '100%',
  },
  cover: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    objectFit: 'cover',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  },
  descriptionContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  paymentMethodContainer: {
    marginTop: theme.spacing(2),
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
}));

export default GiftcardCardDetail;
