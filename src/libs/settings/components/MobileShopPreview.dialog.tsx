import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import {
  DialogContent,
  DialogTitle,
  makeStyles,
  Paper,
  Theme,
  useTheme,
} from '@material-ui/core';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import muiIconNames from '#components/input/muiIcon/muiIconNames';
import { CustomShopRedirection } from '../types';
import { SubShop } from '#libs/shop/types';
import { MuiIconName } from '#components/input/muiIcon/MuiIconNameType';
import { getTextColorFromRGB } from '../../../utils/color';

type Props = {
  shopRedirections: CustomShopRedirection[];
  paymentComboListCount: number;
  paymentPackListCount: number;
  contractListCount: number;
  vodListCount: number;
  giftcardsCount: number;
  subshopList: SubShop[];
  onClose: () => void;
};

const MobileShopPreview: React.FC<Props> = ({
  shopRedirections,
  paymentComboListCount,
  paymentPackListCount,
  contractListCount,
  vodListCount,
  giftcardsCount,
  subshopList,
  onClose,
}) => {
  const { t } = useTranslation(['settings']);
  const classes = useStyles();

  return (
    <Dialog
      open
      onClose={onClose}
      classes={{
        paper: classes.popup,
      }}
    >
      <DialogTitle>
        {t('mobilePersonalization.externalShopRedirection.popupPreview.title')}
      </DialogTitle>
      <DialogContent className={classes.mobileSimulation}>
        <WavyHeader>
          <div className={classes.innerPadding}>
            <div className={classes.subtitleMobile}>
              {t(
                'mobilePersonalization.externalShopRedirection.popupPreview.ourOffers',
              )}
            </div>
            <div className={classes.verticalList}>
              {paymentPackListCount > 0 && (
                <MobileShopPreviewCard
                  title={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.paymentPack',
                  )}
                  subtitle={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.paymentPackSubtitle',
                  )}
                  iconName="CreditCard"
                />
              )}
              {contractListCount > 0 && (
                <MobileShopPreviewCard
                  title={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.contract',
                  )}
                  subtitle={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.contractSubtitle',
                  )}
                  iconName="Loyalty"
                />
              )}
              {vodListCount > 0 && (
                <MobileShopPreviewCard
                  title={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.vod',
                  )}
                  subtitle={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.vodSubtitle',
                  )}
                  iconName="Movie"
                />
              )}
              {paymentComboListCount > 0 && (
                <MobileShopPreviewCard
                  title={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.category.paymentCombo',
                  )}
                  subtitle={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.paymentComboSubtitle',
                  )}
                  iconName="LocalOffer"
                />
              )}
              {giftcardsCount > 0 && (
                <MobileShopPreviewCard
                  title={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.category.giftcard',
                  )}
                  subtitle={t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.giftcardSubtitle',
                  )}
                  iconName="CardGiftcard"
                />
              )}

              {shopRedirections?.map((link, index) => (
                <MobileShopPreviewCard
                  key={index}
                  title={link.name}
                  iconName={link.icon}
                />
              ))}
            </div>

            <div className={classes.subtitle}>
              {t(
                'mobilePersonalization.externalShopRedirection.popupPreview.inventory',
              )}
            </div>

            <div className={classes.bottomList}>
              <Paper className={classnames(classes.card, classes.square)}>
                <CreditCardIcon className={classes.icon} />
                <div className={classes.cardTitle}>
                  {t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.consumerPaymentPack',
                  )}
                </div>
              </Paper>
              <Paper className={classnames(classes.card, classes.square)}>
                <LoyaltyIcon className={classes.icon} />
                <div className={classes.cardTitle}>
                  {t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.mySubscription',
                  )}
                </div>
              </Paper>
              <Paper className={classnames(classes.card, classes.square)}>
                <ReceiptIcon className={classes.icon} />
                <div className={classes.cardTitle}>
                  {t(
                    'mobilePersonalization.externalShopRedirection.popupPreview.membershipCard.invoice',
                  )}
                </div>
              </Paper>
            </div>
            <div
              className={classnames(classes.verticalList, classes.marginTop)}
            >
              {subshopList?.map((subshop) => (
                <MobileShopPreviewCard key={subshop.id} title={subshop.name} />
              ))}
            </div>
          </div>
        </WavyHeader>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          {t(
            'mobilePersonalization.externalShopRedirection.popupPreview.cancel',
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MobileShopPreviewCard: React.FC<{
  title: string;
  subtitle?: string;
  iconName?: MuiIconName;
}> = ({ title, subtitle, iconName }) => {
  const classes = useStyles();
  const MuiIconComponent = muiIconNames?.[iconName] ?? null;

  return (
    <Paper className={classes.card}>
      <div>
        <div className={classes.cardTitle}>{title}</div>
        {subtitle && <div className={classes.cardSubTitle}>{subtitle}</div>}
      </div>
      <div className={classes.row}>
        {MuiIconComponent && <MuiIconComponent className={classes.icon} />}
        <ChevronRightIcon className={classes.chevronIcon} />
      </div>
    </Paper>
  );
};

const WavyHeader: React.FC<{
  children: React.ReactChild;
  height?: number;
}> = ({ height = 400, children }) => {
  const theme: Theme = useTheme();

  return (
    <div>
      <svg
        viewBox="0 0 375 174"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="wave">
            <path d="M220.5 160.464C132.584 125.877 54.2077 134.467 0 173.326V33 0 33 0H375V133.032C323.142 165.064 269.831 179.872 220.5 160.464Z" />
          </clipPath>
          <linearGradient id="MyGradient" y2="100%">
            <stop offset="100%" stopColor="rgb(0,0,0)" stopOpacity={0.24} />
            <stop offset="0%" stopColor="rgb(0,0,0)" stopOpacity={0.88} />
          </linearGradient>
        </defs>
        <rect
          fill={theme.palette.primary.main}
          x="0"
          y="0"
          width="375"
          height="174"
          clipPath="url(#wave)"
        />
      </svg>
      <div style={{ marginTop: -height }}>{children}</div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  popup: {
    minWidth: 600,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  card: {
    padding: theme.spacing(2),
    minHeight: 80,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  cardSubTitle: {
    fontSize: 12,
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  icon: {
    fill: 'black',
    height: 40,
    width: 40,
    marginRight: theme.spacing(2),
  },
  chevronIcon: {
    fill: 'black',
    height: 20,
    width: 20,
  },
  verticalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  bottomList: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  mobileSimulation: {
    backgroundColor: theme.palette.grey[200],
    padding: 0,
  },
  innerPadding: {
    padding: theme.spacing(2),
  },
  bottomPaper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    flex: 1,
  },
  square: {
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing(2),
  },
  subtitleMobile: {
    fontWeight: 700,
    fontSize: 16,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
    color: getTextColorFromRGB(theme.palette.primary.main),
  },
  subtitle: {
    fontWeight: 700,
    fontSize: 16,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

export default MobileShopPreview;
