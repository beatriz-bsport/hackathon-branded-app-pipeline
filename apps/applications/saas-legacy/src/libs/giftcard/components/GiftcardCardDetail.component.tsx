import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import TodayIcon from '@material-ui/icons/Today';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';
import AvailablePaymentMethodList from '../../payment/components/AvailablePaymentMethodList.component';

import type { Giftcard } from '../types';
import { GIFTCARD_TYPES } from '../constants';

type Props = {
  giftcard: Giftcard;
  noCover?: boolean;
  snackbarSuccess: (msg: string) => void;
};

const GiftcardCardDetail: FC<Props> = ({
  giftcard,
  noCover,
  snackbarSuccess,
}) => {
  const { t } = useTranslation(['giftcard', 'b2b_giftcard']);
  const classes = useStyles();

  const displayedPrice =
    giftcard.card_type === GIFTCARD_TYPES.CUSTOM || !giftcard.price
      ? t('giftcardFreeAmount.customAmount', { ns: 'b2b_giftcard' })
      : getCurrencyDisplayWithPrice(giftcard.price);

  return (
    <div className={classes.container}>
      {giftcard.cover && !noCover ? (
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
            {displayedPrice}
          </Typography>
        </div>
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="billing.allowed_actions.readPaymentLink"
        >
          <CopyToClipboard
            text={`${window.location.origin}/checkout/${giftcard.company}/giftcard/${giftcard.id}/?force=true`}
          >
            <ButtonBase
              className={classes.link}
              id="button_pass_copy"
              onClick={() => snackbarSuccess?.('link.copied')}
            >
              <LinkIcon />
              <Typography className={classes.linkTypo}>
                {t('link.copyLink', { ns: 'giftcard' })}
              </Typography>
            </ButtonBase>
          </CopyToClipboard>
        </ObjectLevelPermissionWrapper>
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
                ns: 'giftcard',
              })}
            </Typography>
          </div>
        )}
        {giftcard.manager_only && (
          <div className={classes.row}>
            <VisibilityOffIcon className={classes.iconLeft} />
            <Typography variant="body2">
              {t('giftcard.detail.manager_only', { ns: 'giftcard' })}
            </Typography>
          </div>
        )}
        <div className={classes.paymentMethodContainer}>
          <Typography color="textSecondary" variant="body2">
            {t('giftcard.detail.availablePaymentMethods', { ns: 'giftcard' })}
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
