// @flow

import React from 'react';
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
} from '../upsell-identifiers';

type Props = {
  upsellPackage: any;
  onKnowMore: (id: number) => void;
  children?: React.ReactChild;
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(2),
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
    width: '100%',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
  iframe: {
    height: '100%',
    width: '100%',
  },
}));

const UpsellPackageCustomApp = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <MobileFriendlyIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageTablet = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <TabletIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageDailyPayment = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <TodayIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageZoomApp = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <DuoIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageClassPass = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <SendToMobileIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageAnalytics = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <AnalyticsIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackagePremium = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <StarIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageYoutubeAndVimeo = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <PlayCircleIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageActiveCampaign = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <AllInboxIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPushNotification = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <NotificationsActiveIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellMasterAccount = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <SupervisorAccountIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageWhereby = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <VideocamIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageVod = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <VideoLibraryIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageQuickbooks = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <ReceiptIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPackageSpotScheduling = (props: Props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <DirectionsBikeIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellClockIn: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <TimerIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellGuest: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <PersonAddIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const UpsellPremiumSupport: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <DefaultTemplate {...props}>
      <HelpOutlinedIcon className={classes.icon} />
    </DefaultTemplate>
  );
};

const DefaultTemplate = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>{props.children}</div>
        <div className={classes.innerContainer}>
          <div>
            <Typography variant="h6">{upsellPackage.name}</Typography>
            <div className={classes.innerDescription}>
              {upsellPackage.description_html ? (
                <iframe
                  title="upsell-package-default-template-iframe"
                  srcDoc={props.upsellPackage.description_html}
                  className={classes.iframe}
                  frameBorder="0"
                />
              ) : (
                <Typography>{upsellPackage.description}</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        {!!props.onKnowMore && !upsellPackage.subscribed && (
          <Button
            variant="outlined"
            onClick={() => props.onKnowMore(upsellPackage.id)}
          >
            <HelpOutlinedIcon className={classes.iconLeft} />
            {t('upsellPackage.knowMore')}
          </Button>
        )}
      </div>
    </Paper>
  );
};

const UpsellPackageSMS = (props: Omit<Props, 'children'>) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>
          <SMSIcon className={classes.icon} />
        </div>
        <div className={classes.innerContainer}>
          <Typography variant="h6">{upsellPackage.name}</Typography>
          <div className={classes.innerDescription}>
            {upsellPackage.description_html ? (
              <iframe
                title="upsell-package-sms-iframe"
                srcDoc={props.upsellPackage.description_html}
                className={classes.iframe}
                frameBorder="0"
              />
            ) : (
              <Typography>{upsellPackage.description}</Typography>
            )}
          </div>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        {!!props.onKnowMore && !upsellPackage.subscribed && (
          <Button
            variant="outlined"
            onClick={() => props.onKnowMore(upsellPackage.id)}
          >
            <HelpOutlinedIcon className={classes.iconLeft} />
            {t('upsellPackage.knowMore')}
          </Button>
        )}
      </div>
    </Paper>
  );
};

const UPSELL_REGISTRY = {
  [UPSELL_IDENTIFIER_CUSTOM_APP]: UpsellPackageCustomApp,
  [UPSELL_IDENTIFIER_WHEREBY]: UpsellPackageWhereby,
  [UPSELL_IDENTIFIER_DAILY_PAIMENT]: UpsellPackageDailyPayment,
  [UPSELL_IDENTIFIER_VOD]: UpsellPackageVod,
  [UPSELL_IDENTIFIER_SMS]: UpsellPackageSMS,
  [UPSELL_IDENTIFIER_ZOOM_APP]: UpsellPackageZoomApp,
  [UPSELL_IDENTIFIER_TABLET]: UpsellPackageTablet,
  [UPSELL_IDENTIFIER_CLASSPASS]: UpsellPackageClassPass,
  [UPSELL_IDENTIFIER_ANALYTICS]: UpsellPackageAnalytics,
  [UPSELL_IDENTIFIER_PREMIUM]: UpsellPackagePremium,
  [UPSELL_IDENTIFIER_VOD_YOUTUBE_AND_VIMEO]: UpsellPackageYoutubeAndVimeo,
  [UPSELL_IDENTIFIER_ACTIVE_CAMPAIGN]: UpsellPackageActiveCampaign,
  [UPSELL_IDENTIFIER_QUICKBOOKS]: UpsellPackageQuickbooks,
  [UPSELL_IDENTIFIER_SPOT_SCHEDULING]: UpsellPackageSpotScheduling,
  [UPSELL_IDENTIFIER_PUSH_NOTIFICATION]: UpsellPushNotification,
  [UPSELL_IDENTIFIER_MASTER_ACCOUNT]: UpsellMasterAccount,
  [UPSELL_IDENTIFIER_CLOCK_IN]: UpsellClockIn,
  [UPSELL_IDENTIFIER_GUEST]: UpsellGuest,
  [UPSELL_IDENTIFIER_PREMIUM_SUPPORT]: UpsellPremiumSupport,
};

export const getUpsellPackageComponent = (upsellIdentifier: number) => {
  if (upsellIdentifier in UPSELL_REGISTRY) {
    return UPSELL_REGISTRY[upsellIdentifier];
  }
  return UpsellMasterAccount;
};

export default getUpsellPackageComponent;
