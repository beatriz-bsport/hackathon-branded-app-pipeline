// @flow
import React from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import Divider from '@material-ui/core/Divider';

import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind';
import { Campaign, Recipient } from '../types';

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
  onClickReport: () => void;
  kind: number;
}> = ({ total_read, total_click, total_recipients, kind, onClickReport }) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);

  return (
    <React.Fragment>
      {kind === COMMUNICATION_KIND_EMAIL && (
        <React.Fragment>
          <div className={classes.counters}>
            <Typography variant="subtitle2">
              {`${((total_read / total_recipients) * 100).toFixed(1)}%`}
            </Typography>
            <Typography color="textSecondary">
              {t('campaign.readCount')}
            </Typography>
          </div>
          <div className={classes.counters}>
            <Typography variant="subtitle2">
              {`${((total_click / total_recipients) * 100).toFixed(1)}%`}
            </Typography>
            <Typography color="textSecondary">
              {t('campaign.clickCount')}
            </Typography>
          </div>
        </React.Fragment>
      )}
      <Button
        onClick={onClickReport}
        variant="outlined"
        className={classes.button}
      >
        <VisibilityOnIcon className={classes.leftIcon} />
        {t('campaign.showReport')}
      </Button>
    </React.Fragment>
  );
};

const SingleRecipientInfo: React.FC<{
  recipient: Recipient;
  kind: number;
  onClickShow: () => void;
}> = ({ recipient, kind, onClickShow }) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);

  return (
    <React.Fragment>
      {kind === COMMUNICATION_KIND_EMAIL && (
        <React.Fragment>
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
        </React.Fragment>
      )}
      <Button
        onClick={onClickShow}
        variant="outlined"
        className={classes.button}
      >
        <VisibilityOnIcon className={classes.leftIcon} />
        {t(
          kind === COMMUNICATION_KIND_EMAIL
            ? 'recipient.showEmail'
            : 'recipient.showSms',
        )}
      </Button>
    </React.Fragment>
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
  const { subject, body, tags_groups } = data;
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

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.firstLeftPanel}>
          {kind === COMMUNICATION_KIND_EMAIL && (
            <MailIcon className={classes.mailIcon} />
          )}
          {kind === COMMUNICATION_KIND_SMS && (
            <SmsIcon className={classes.mailIcon} />
          )}
          <div className={classes.leftPanel}>
            {subject ? (
              <>
                <Typography variant="h6" color="primary">
                  {interpolate(subject)}
                </Typography>
                {subject.match(regexInterpolateValue) &&
                  ((tags_groups ?? []).length === 0 ||
                    tags_groups?.length > 1) && (
                    <Typography variant="caption" color="secondary">
                      {t('mail.titleInterpolated')}
                    </Typography>
                  )}
              </>
            ) : (
              <Typography variant="h6" color="primary">
                {t(`campaign.kind.${kind}`)}
              </Typography>
            )}
            {singleRecipientData ? (
              <Typography>
                {t(`recipient.status.${singleRecipientData.status}`)}
              </Typography>
            ) : (
              <Typography>
                {t('campaign.recipientCount', { total_recipients })}
              </Typography>
            )}
            <Typography color="textSecondary">
              {t('campaign.sentAt', {
                date_created: moment(date_created).format('LLLL'),
              })}
            </Typography>
          </div>
        </div>
        {singleRecipientData || kind === COMMUNICATION_KIND_SMS ? (
          <SingleRecipientInfo
            recipient={singleRecipientData}
            onClickShow={() =>
              onClickShow(interpolate(body || campaign.sms_text))
            }
            kind={kind}
          />
        ) : (
          <MultiRecipientStat
            total_read={total_read}
            total_recipients={total_recipients}
            total_click={total_click}
            kind={kind}
            onClickReport={onClickReport}
          />
        )}
      </div>
      <Divider className={classes.divider} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  firstLeftPanel: {
    display: 'flex',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  counters: {
    marginTop: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

export default CampaignListItem;
