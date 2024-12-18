import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import Divider from '@material-ui/core/Divider';

import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';

import {
  SEND_COMMUNICATION_ON_JOIN,
  SEND_COMMUNICATION_ON_LEFT,
} from '@bsport/common/lib/master-data/smart-list';
import { COMMUNICATION_SEND_STATUS_PROCESSING } from '../constants';
import { Campaign, Recipient } from '../types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type Props = {
  campaign: Campaign;
  singleRecipientData: Recipient;
  onClickShow: (body: string) => void;
  onClickReport: () => void;
};

const MultiRecipientStat: React.FC<{
  total_read: number;
  total_click: number;
  total_recipients: number;
  isProcessing: boolean;
  kind: number;
}> = ({ total_read, total_click, total_recipients, kind, isProcessing }) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);

  return (
    <>
      {kind === COMMUNICATION_KIND_EMAIL && (
        <div className={classes.countersContainer}>
          <div className={classes.counters}>
            <Typography variant="subtitle2">
              {isProcessing
                ? t('campaign.processing')
                : `${(
                    ((total_read || 0) / (total_recipients || 1)) *
                    100
                  ).toFixed(1)}%`}
            </Typography>
            <Typography color="textSecondary">
              {t('campaign.readCount')}
            </Typography>
          </div>
          <div className={classes.counters}>
            <Typography variant="subtitle2">
              {isProcessing
                ? t('campaign.processing')
                : `${(
                    ((total_click || 0) / (total_recipients || 1)) *
                    100
                  ).toFixed(1)}%`}
            </Typography>
            <Typography color="textSecondary">
              {t('campaign.clickCount')}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

const MultiRecipientStatAction: React.FC<{
  onClickReport: () => void;
  campaign: Campaign;
}> = ({ onClickReport, campaign }) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);

  return (
    <Button
      className={classes.button}
      // @ts-expect-error
      disabled={campaign.status === COMMUNICATION_SEND_STATUS_PROCESSING}
      onClick={onClickReport}
      variant="outlined"
    >
      <VisibilityOnIcon className={classes.leftIcon} />
      {t('campaign.showReport')}
    </Button>
  );
};

const SingleRecipientInfo: React.FC<{
  recipient: Recipient;
  kind: number;
}> = ({ recipient, kind }) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);

  return (
    <>
      {kind === COMMUNICATION_KIND_EMAIL && (
        <div className={classes.countersContainer}>
          <div className={classes.counters}>
            <Typography variant="subtitle2">{recipient.read_count}</Typography>
            <Typography color="textSecondary">
              {t('recipient.readCount')}
            </Typography>
          </div>
          <div className={classes.counters}>
            <Typography variant="subtitle2">
              {recipient.links_opened_count}
            </Typography>
            <Typography color="textSecondary">
              {t('recipient.clicksCount')}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

const SingleRecipientInfoAction: React.FC<{
  kind: number;
  onClickShow: () => void;
}> = ({ kind, onClickShow }) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);
  return (
    <Button className={classes.button} onClick={onClickShow} variant="outlined">
      <VisibilityOnIcon className={classes.leftIcon} />
      {t(
        (kind === COMMUNICATION_KIND_EMAIL && 'recipient.showEmail') ||
          (kind === COMMUNICATION_KIND_SMS && 'recipient.showSms') ||
          (kind === COMMUNICATION_KIND_PUSH_NOTIFICATION &&
            'recipient.showNotification'),
      )}
    </Button>
  );
};

export const CampaignListItem: React.FC<Props> = ({
  singleRecipientData,
  campaign: {
    date_created,
    data,
    total_recipients,
    total_read,
    total_click,
    kind,
  },
  campaign,
  onClickShow,
  onClickReport,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);

  const { subject, body, tags_groups } = data || {};
  const regexInterpolateValue = /[^{]*{[^}]*}/;

  const interpolate = (value: string) => {
    if (tags_groups?.length === 0 || !tags_groups) {
      return value;
    }

    let newString = value;
    Object.keys(tags_groups[0]).forEach((key) => {
      const regex = new RegExp(key, 'g');
      newString = newString.replace(regex, tags_groups[0]?.[key]);
    });

    return newString;
  };

  // @ts-expect-error
  const handleClickShow = () => onClickShow(interpolate(body || campaign.text));

  // @ts-expect-error
  const isProcessing = campaign.status === COMMUNICATION_SEND_STATUS_PROCESSING;

  return (
    <>
      <div className={classes.container}>
        <div className={classes.campaignInfoOutter}>
          <div className={classes.campaignInfoInner}>
            <div className={classes.info}>
              {kind === COMMUNICATION_KIND_EMAIL && (
                <MailIcon className={classes.mailIcon} />
              )}
              {kind === COMMUNICATION_KIND_SMS && (
                <SmsIcon className={classes.mailIcon} />
              )}
              {kind === COMMUNICATION_KIND_PUSH_NOTIFICATION && (
                <MobileScreenShareIcon className={classes.mailIcon} />
              )}
              <>
                <div className={classes.column}>
                  {subject ? (
                    <>
                      <Typography color="primary" variant="h6">
                        {interpolate(subject)}
                      </Typography>
                      {subject.match(regexInterpolateValue) &&
                        ((tags_groups ?? []).length === 0 ||
                          tags_groups?.length > 1) && (
                          <Typography color="secondary" variant="caption">
                            {t('mail.titleInterpolated')}
                          </Typography>
                        )}
                    </>
                  ) : (
                    <Typography color="primary" variant="h6">
                      {t(`campaign.kind.${kind}`)}
                    </Typography>
                  )}
                  {singleRecipientData ? (
                    <Typography>
                      {t(`recipient.status.${singleRecipientData.status}`)}
                    </Typography>
                  ) : (
                    <Typography>
                      {t('campaign.recipientCount', {
                        total_recipients: isProcessing
                          ? t('campaign.processing')
                          : total_recipients,
                      })}
                    </Typography>
                  )}
                  <Typography color="textSecondary">
                    {t('campaign.sentAt', {
                      date_created: formatAsDatetimeAdapted(
                        date_created,
                        'DDDD t',
                      ),
                    })}
                  </Typography>
                </div>
              </>
            </div>
            {campaign?.automated_campaign?.event_kind ===
            SEND_COMMUNICATION_ON_JOIN ? (
              <div className={classes.row}>
                <DoubleArrowIcon
                  className={classes.joinIcon}
                  fontSize="small"
                />
                <Typography variant="caption">
                  {t('campaign.automated.onJoin')}
                </Typography>
              </div>
            ) : null}
            {campaign?.automated_campaign?.event_kind ===
            SEND_COMMUNICATION_ON_LEFT ? (
              <div className={classes.row}>
                <DoubleArrowIcon
                  className={classes.leavingIcon}
                  fontSize="small"
                />
                <Typography variant="caption">
                  {t('campaign.automated.onLeft')}
                </Typography>
              </div>
            ) : null}
          </div>
        </div>
        <div className={classes.campaignStatsOutter}>
          {singleRecipientData ||
          [
            COMMUNICATION_KIND_SMS,
            COMMUNICATION_KIND_PUSH_NOTIFICATION,
          ].includes(kind) ? (
            <SingleRecipientInfo kind={kind} recipient={singleRecipientData} />
          ) : (
            <MultiRecipientStat
              isProcessing={isProcessing}
              kind={kind}
              total_click={total_click}
              total_read={total_read}
              total_recipients={total_recipients}
            />
          )}
        </div>
        <div className={classes.campaignActionsOutter}>
          {singleRecipientData ||
          [
            COMMUNICATION_KIND_SMS,
            COMMUNICATION_KIND_PUSH_NOTIFICATION,
          ].includes(kind) ? (
            <SingleRecipientInfoAction
              kind={kind}
              onClickShow={handleClickShow}
            />
          ) : (
            <MultiRecipientStatAction
              campaign={campaign}
              onClickReport={onClickReport}
            />
          )}
        </div>
      </div>
      <Divider className={classes.divider} />
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
    },
  },
  campaignInfoOutter: {
    flex: 2,
  },
  campaignInfoInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  info: {
    display: 'flex',
  },
  campaignStatsOutter: {
    flex: 2,
  },
  campaignActionsOutter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      flex: '1 0 100%',
      justifyContent: 'flex-start',
      paddingTop: theme.spacing(1),
    },
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  mailIcon: {
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(1) / 2,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(5.5),
    },
  },
  countersContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  },
  counters: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  },
  button: {
    marginTop: theme.spacing(1),
  },
  joinIcon: {
    color: '#00c853',
    marginRight: theme.spacing(1),
  },
  leavingIcon: {
    color: '#ff3d00',
    transform: 'rotate(180deg)',
    marginRight: theme.spacing(1),
  },
}));

export default CampaignListItem;
