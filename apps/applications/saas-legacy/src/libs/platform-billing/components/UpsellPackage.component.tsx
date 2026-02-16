import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import TodayIcon from '@material-ui/icons/Today';
import { makeStyles } from '@material-ui/core/styles';
import SMSIcon from '@material-ui/icons/Sms';
import HelpOutlinedIcon from '@material-ui/icons/HelpOutline';
import DuoIcon from '@material-ui/icons/Duo';
import TabletIcon from '@material-ui/icons/Tablet';
import AnalyticsIcon from '@material-ui/icons/Assessment';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import PlayCircleIcon from '@material-ui/icons/PlayCircleFilled';
import SendToMobileIcon from '@material-ui/icons/MobileScreenShare';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import StarIcon from '@material-ui/icons/Star';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import ReceiptIcon from '@material-ui/icons/Receipt';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import TimerIcon from '@material-ui/icons/Timer';
import Typography from '@material-ui/core/Typography';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import memoize from 'lodash/memoize';
import { UpsellPackage } from '#src/libs/company/types';
import {
  UPSELL_IDENTIFIER_CUSTOM_APP,
  UPSELL_IDENTIFIER_VOD,
  UPSELL_IDENTIFIER_WHEREBY,
  UPSELL_IDENTIFIER_SMS,
  UPSELL_IDENTIFIER_ZOOM_APP,
  UPSELL_IDENTIFIER_DAILY_PAIMENT,
  UPSELL_IDENTIFIER_TABLET,
  UPSELL_IDENTIFIER_CLASSPASS,
  UPSELL_IDENTIFIER_VOD_YOUTUBE_AND_VIMEO,
  UPSELL_IDENTIFIER_PREMIUM,
  UPSELL_IDENTIFIER_ACTIVE_CAMPAIGN,
  UPSELL_IDENTIFIER_ANALYTICS,
  UPSELL_IDENTIFIER_SPOT_SCHEDULING,
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_QUICKBOOKS,
  UPSELL_IDENTIFIER_MASTER_ACCOUNT,
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_GUEST,
  UPSELL_IDENTIFIER_PREMIUM_SUPPORT,
  UPSELL_IDENTIFIER_WELLHUB,
  UPSELL_IDENTIFIER_FISKALY,
  UPSELL_IDENTIFIER_FISKALY_SIGN_ES,
  UPSELL_IDENTIFIER_MY_CLUBS,
} from '../upsell-identifiers';
import WellhubLogoIcon from '#src/components/icons/WellhubLogoIcon.component';
import FiskalyLogoIcon from '#src/components/icons/FiskalyLogoIcon.component';
import MyClubsLogoIcon from '#src/components/icons/MyClubsLogoIcon.component';

type Props = {
  upsellPackage: UpsellPackage;
  onKnowMore?: (upsellIdentifier: number) => void;
  handleSubscribe?: (upsellPackage: UpsellPackage) => void;
  isUsingBundledPricing?: boolean;
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  upsellContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  icon: {
    height: 120,
    width: 120,
  },
  iconContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: theme.spacing(3),
  },
  innerContainer: {
    flex: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  innerDescription: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iframe: {
    height: '100%',
    width: '100%',
  },
}));

export const MAP_UPSELL_IDENTIFIER_TO_ICON_COMPONENT = {
  [UPSELL_IDENTIFIER_CUSTOM_APP]: MobileFriendlyIcon,
  [UPSELL_IDENTIFIER_WHEREBY]: VideocamIcon,
  [UPSELL_IDENTIFIER_DAILY_PAIMENT]: TodayIcon,
  [UPSELL_IDENTIFIER_VOD]: VideoLibraryIcon,
  [UPSELL_IDENTIFIER_SMS]: SMSIcon,
  [UPSELL_IDENTIFIER_ZOOM_APP]: DuoIcon,
  [UPSELL_IDENTIFIER_TABLET]: TabletIcon,
  [UPSELL_IDENTIFIER_CLASSPASS]: SendToMobileIcon,
  [UPSELL_IDENTIFIER_ANALYTICS]: AnalyticsIcon,
  [UPSELL_IDENTIFIER_PREMIUM]: StarIcon,
  [UPSELL_IDENTIFIER_VOD_YOUTUBE_AND_VIMEO]: PlayCircleIcon,
  [UPSELL_IDENTIFIER_ACTIVE_CAMPAIGN]: AllInboxIcon,
  [UPSELL_IDENTIFIER_QUICKBOOKS]: ReceiptIcon,
  [UPSELL_IDENTIFIER_SPOT_SCHEDULING]: DirectionsBikeIcon,
  [UPSELL_IDENTIFIER_PUSH_NOTIFICATION]: NotificationsActiveIcon,
  [UPSELL_IDENTIFIER_MASTER_ACCOUNT]: SupervisorAccountIcon,
  [UPSELL_IDENTIFIER_CLOCK_IN]: TimerIcon,
  [UPSELL_IDENTIFIER_GUEST]: PersonAddIcon,
  [UPSELL_IDENTIFIER_PREMIUM_SUPPORT]: HelpOutlinedIcon,
  [UPSELL_IDENTIFIER_WELLHUB]: WellhubLogoIcon,
  [UPSELL_IDENTIFIER_FISKALY]: FiskalyLogoIcon,
  [UPSELL_IDENTIFIER_FISKALY_SIGN_ES]: FiskalyLogoIcon,
  [UPSELL_IDENTIFIER_MY_CLUBS]: MyClubsLogoIcon,
};

const createUpsellPackageComponent = memoize(
  (upsellIdentifier: keyof typeof MAP_UPSELL_IDENTIFIER_TO_ICON_COMPONENT) =>
    (props: Props) => {
      const classes = useStyles();
      const { t } = useTranslation('platformBilling');
      const { upsellPackage, onKnowMore } = props;
      const UpsellCustomIcon =
        MAP_UPSELL_IDENTIFIER_TO_ICON_COMPONENT[upsellIdentifier];

      const showMoreUpsellInformation = useCallback(() => {
        return onKnowMore ? onKnowMore(upsellPackage.upsell_identifier) : {};
      }, [onKnowMore, upsellPackage.upsell_identifier]);

      return (
        <Paper className={classes.paperContainer}>
          <div className={classes.upsellContent}>
            <div className={classes.iconContainer}>
              <UpsellCustomIcon className={classes.icon} />
            </div>
            <div className={classes.innerContainer}>
              <Typography variant="h6">{upsellPackage.name}</Typography>
              <div className={classes.innerDescription}>
                <Typography>{upsellPackage.description}</Typography>
              </div>
            </div>
          </div>
          <div className={classes.bottomContainer}>
            <div />
            <div className={classes.buttonContainer}>
              {onKnowMore && (
                <Button onClick={showMoreUpsellInformation} variant="outlined">
                  <HelpOutlinedIcon className={classes.iconLeft} />
                  {t('upsellPackage.knowMore')}
                </Button>
              )}
            </div>
          </div>
        </Paper>
      );
    },
);

const UPSELL_REGISTRY = {
  [UPSELL_IDENTIFIER_CUSTOM_APP]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_CUSTOM_APP,
  ),
  [UPSELL_IDENTIFIER_WHEREBY]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_WHEREBY,
  ),
  [UPSELL_IDENTIFIER_DAILY_PAIMENT]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_DAILY_PAIMENT,
  ),
  [UPSELL_IDENTIFIER_VOD]: createUpsellPackageComponent(UPSELL_IDENTIFIER_VOD),
  [UPSELL_IDENTIFIER_SMS]: createUpsellPackageComponent(UPSELL_IDENTIFIER_SMS),
  [UPSELL_IDENTIFIER_ZOOM_APP]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_ZOOM_APP,
  ),
  [UPSELL_IDENTIFIER_TABLET]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_TABLET,
  ),
  [UPSELL_IDENTIFIER_CLASSPASS]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_CLASSPASS,
  ),
  [UPSELL_IDENTIFIER_ANALYTICS]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_ANALYTICS,
  ),
  [UPSELL_IDENTIFIER_PREMIUM]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_PREMIUM,
  ),
  [UPSELL_IDENTIFIER_VOD_YOUTUBE_AND_VIMEO]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_VOD_YOUTUBE_AND_VIMEO,
  ),
  [UPSELL_IDENTIFIER_ACTIVE_CAMPAIGN]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_ACTIVE_CAMPAIGN,
  ),
  [UPSELL_IDENTIFIER_QUICKBOOKS]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_QUICKBOOKS,
  ),
  [UPSELL_IDENTIFIER_SPOT_SCHEDULING]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_SPOT_SCHEDULING,
  ),
  [UPSELL_IDENTIFIER_PUSH_NOTIFICATION]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  ),
  [UPSELL_IDENTIFIER_MASTER_ACCOUNT]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_MASTER_ACCOUNT,
  ),
  [UPSELL_IDENTIFIER_CLOCK_IN]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_CLOCK_IN,
  ),
  [UPSELL_IDENTIFIER_GUEST]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_GUEST,
  ),
  [UPSELL_IDENTIFIER_PREMIUM_SUPPORT]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_PREMIUM_SUPPORT,
  ),
  [UPSELL_IDENTIFIER_WELLHUB]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_WELLHUB,
  ),
  [UPSELL_IDENTIFIER_FISKALY]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_FISKALY,
  ),
  [UPSELL_IDENTIFIER_FISKALY_SIGN_ES]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_FISKALY_SIGN_ES,
  ),
  [UPSELL_IDENTIFIER_MY_CLUBS]: createUpsellPackageComponent(
    UPSELL_IDENTIFIER_MY_CLUBS,
  ),
};

export const getUpsellPackageComponent = (upsellIdentifier: number) => {
  if (upsellIdentifier in UPSELL_REGISTRY) {
    return UPSELL_REGISTRY[upsellIdentifier as keyof typeof UPSELL_REGISTRY];
  }
  return UPSELL_REGISTRY[UPSELL_IDENTIFIER_MASTER_ACCOUNT];
};

export default getUpsellPackageComponent;
