// @flow

import React from 'react';

import Paper from '@material-ui/core/Paper';
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import TodayIcon from '@material-ui/icons/Today';
import { makeStyles } from '@material-ui/core/styles';
import SMSIcon from '@material-ui/icons/Sms';
import HelpOutlinedIcon from '@material-ui/icons/HelpOutline';
import DuoIcon from '@material-ui/icons/Duo';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplay } from '../../theme/selectors';

const CUSTOM_APP = 1;
const WHEREBY = 3;
const VOD = 2;
const SMS = 4;
const ZOOM_APP = 5;
const DAILY_PAIMENT = 6;

type Props = {
  upsellPackage: UpsellPackage,
  onKnowMore: (id: number) => void,
  onRequestUpsell: (id: number) => void,
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
}));

const UpsellPackageCustomApp = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>
          <MobileFriendlyIcon className={classes.icon} />
        </div>
        <div className={classes.innerContainer}>
          <div>
            <Typography variant="h6">{upsellPackage.name}</Typography>
            <div className={classes.innerDescription}>
              {upsellPackage.description_html ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: props.upsellPackage.description_html,
                  }}
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
        <Button
          disabled={upsellPackage.subscribed}
          variant="contained"
          color="primary"
          onClick={() => props.onRequestUpsell(upsellPackage.id)}
        >
          <CheckIcon className={classes.iconLeft} />
          {upsellPackage.is_recurrent
            ? t('upsellPackage.billRecurrent', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })
            : t('upsellPackage.billOnce', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })}
        </Button>
      </div>
    </Paper>
  );
};

const UpsellPackageDailyPayment = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>
          <TodayIcon className={classes.icon} />
        </div>
        <div className={classes.innerContainer}>
          <div>
            <Typography variant="h6">{upsellPackage.name}</Typography>
            <div className={classes.innerDescription}>
              {upsellPackage.description_html ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: props.upsellPackage.description_html,
                  }}
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
        <Button
          disabled={upsellPackage.subscribed}
          variant="contained"
          color="primary"
          onClick={() => props.onRequestUpsell(upsellPackage.id)}
        >
          <CheckIcon className={classes.iconLeft} />
          {upsellPackage.is_recurrent
            ? t('upsellPackage.billRecurrent', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })
            : t('upsellPackage.billOnce', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })}
        </Button>
      </div>
    </Paper>
  );
};

const UpsellPackageWhereby = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>
          <VideocamIcon className={classes.icon} />
        </div>
        <div className={classes.innerContainer}>
          <Typography variant="h6">{upsellPackage.name}</Typography>
          <div className={classes.innerDescription}>
            {upsellPackage.description_html ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: props.upsellPackage.description_html,
                }}
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
        <Button
          disabled={upsellPackage.subscribed}
          variant="contained"
          color="primary"
          onClick={() => props.onRequestUpsell(upsellPackage.id)}
        >
          <CheckIcon className={classes.iconLeft} />
          {upsellPackage.is_recurrent
            ? t('upsellPackage.billRecurrent', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })
            : t('upsellPackage.billOnce', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })}
        </Button>
      </div>
    </Paper>
  );
};

const UpsellPackageVod = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>
          <VideoLibraryIcon className={classes.icon} />
        </div>
        <div className={classes.innerContainer}>
          <Typography variant="h6">{upsellPackage.name}</Typography>
          <div className={classes.innerDescription}>
            {upsellPackage.description_html ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: props.upsellPackage.description_html,
                }}
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
        <Button
          disabled={upsellPackage.subscribed}
          variant="contained"
          color="primary"
          onClick={() => props.onRequestUpsell(upsellPackage.id)}
        >
          <CheckIcon className={classes.iconLeft} />
          {t('upsellPackage.billRecurrent', {
            price_cts: (upsellPackage.price_cts / 100).toFixed(2),
          }) +
            t('upsellPackage.vod.explainBilling', {
              currencyDisplay: getCurrencyDisplay(),
            })}
        </Button>
      </div>
    </Paper>
  );
};

const UpsellPackageSMS = (props: Props) => {
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
              <div
                dangerouslySetInnerHTML={{
                  __html: props.upsellPackage.description_html,
                }}
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
        <Button
          disabled={upsellPackage.subscribed}
          variant="contained"
          color="primary"
          onClick={() => props.onRequestUpsell(upsellPackage.id)}
        >
          <CheckIcon className={classes.iconLeft} />
          {t('upsellPackage.sms.explainBilling', {
            price_cts: (upsellPackage.price_cts / 100).toFixed(2),
            currencyDisplay: getCurrencyDisplay(),
          })}
        </Button>
      </div>
    </Paper>
  );
};

const UpsellPackageZoomApp = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  const { upsellPackage } = props;
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.upsellContent}>
        <div className={classes.iconContainer}>
          <DuoIcon className={classes.icon} />
        </div>
        <div className={classes.innerContainer}>
          <div>
            <Typography variant="h6">{upsellPackage.name}</Typography>
            <div className={classes.innerDescription}>
              {upsellPackage.description_html ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: props.upsellPackage.description_html,
                  }}
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
        <Button
          disabled={upsellPackage.subscribed}
          variant="contained"
          color="primary"
          onClick={() => props.onRequestUpsell(upsellPackage.id)}
        >
          <CheckIcon className={classes.iconLeft} />
          {upsellPackage.is_recurrent
            ? t('upsellPackage.billRecurrent', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })
            : t('upsellPackage.billOnce', {
                price_cts: (upsellPackage.price_cts / 100).toFixed(2),
              })}
        </Button>
      </div>
    </Paper>
  );
};

const UPSELL_REGISTRY = {
  [CUSTOM_APP]: UpsellPackageCustomApp,
  [WHEREBY]: UpsellPackageWhereby,
  [DAILY_PAIMENT]: UpsellPackageDailyPayment,
  [VOD]: UpsellPackageVod,
  [SMS]: UpsellPackageSMS,
  [ZOOM_APP]: UpsellPackageZoomApp,
};

export const getUpsellPackageComponent = (upsellIdentifier: number) =>
  UPSELL_REGISTRY[upsellIdentifier];

export default getUpsellPackageComponent;
