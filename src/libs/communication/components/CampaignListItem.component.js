// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import moment from 'moment-timezone';
import MailIcon from '@material-ui/icons/Mail';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind';
import SmsIcon from '@material-ui/icons/Sms';
import Divider from '@material-ui/core/Divider';

import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  classes: Object,
  campaign: Campaign,
  singleRecipientData: ?Object,
  onClickShow: (body: string) => void,
  onClickReport: () => void,
};

const MultiRecipientStat = (props: {
  classes: Object,
  t: TFunction,
  total_read: number,
  total_click: number,
  total_recipients: number,
  onClickReport: () => void,
  kind: number,
}) => (
  <React.Fragment>
    {props.kind === COMMUNICATION_KIND_EMAIL && (
      <React.Fragment>
        <div className={props.classes.counters}>
          <Typography variant="subtitle2">
            {`${((props.total_read / props.total_recipients) * 100).toFixed(
              1,
            )}%`}
          </Typography>
          <Typography color="textSecondary">
            {props.t('campaign.readCount')}
          </Typography>
        </div>
        <div className={props.classes.counters}>
          <Typography variant="subtitle2">
            {`${((props.total_click / props.total_recipients) * 100).toFixed(
              1,
            )}%`}
          </Typography>
          <Typography color="textSecondary">
            {props.t('campaign.clickCount')}
          </Typography>
        </div>
      </React.Fragment>
    )}
    <Button
      onClick={props.onClickReport}
      variant="outlined"
      className={props.classes.button}
    >
      <VisibilityOnIcon className={props.classes.leftIcon} />
      {props.t('campaign.showReport')}
    </Button>
  </React.Fragment>
);

const SingleRecipientInfo = (props: {
  classes: Object,
  t: TFunction,
  links_opened_count: number,
  recipient: Recipient,
  body: string,
  kind: number,
  onClickShow: (body: string) => void,
  campaign: Compaign,
}) => (
  <React.Fragment>
    {props.kind === COMMUNICATION_KIND_EMAIL && (
      <React.Fragment>
        <div className={props.classes.counter}>
          <Typography variant="subtitle2">
            {props.recipient.read_count}
          </Typography>
          <Typography color="textSecondary">
            {props.t('recipient.readCount')}
          </Typography>
        </div>
        <div className={props.classes.counter}>
          <Typography variant="subtitle2">
            {props.recipient.links_opened_count}
          </Typography>
          <Typography color="textSecondary">
            {props.t('recipient.clicksCount')}
          </Typography>
        </div>
      </React.Fragment>
    )}
    <Button
      onClick={() => props.onClickShow(props.body || props.campaign.sms_text)}
      variant="outlined"
      className={props.classes.button}
    >
      <VisibilityOnIcon className={props.classes.leftIcon} />
      {props.t(
        props.kind === COMMUNICATION_KIND_EMAIL
          ? 'recipient.showEmail'
          : 'recipient.showSms',
      )}
    </Button>
  </React.Fragment>
);

export const CampaignListItem = (props: Props) => {
  const { campaign, t, classes } = props;
  const {
    date_created,
    data,
    total_recipients,
    total_read,
    total_click,
    kind,
  } = campaign;

  const { subject, body } = data;
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
            <Typography variant="h6" color="primary">
              {subject || props.t(`campaign.kind.${kind}`)}
            </Typography>
            {props.singleRecipientData ? (
              <Typography>
                {props.t(
                  `recipient.status.${props.singleRecipientData.status}`,
                )}
              </Typography>
            ) : (
              <Typography>
                {props.t('campaign.recipientCount', { total_recipients })}
              </Typography>
            )}
            <Typography color="textSecondary">
              {props.t('campaign.sentAt', {
                date_created: moment(date_created).format('LLLL'),
              })}
            </Typography>
          </div>
        </div>
        {props.singleRecipientData || kind === COMMUNICATION_KIND_SMS ? (
          <SingleRecipientInfo
            recipient={props.singleRecipientData}
            campaign={campaign}
            body={body}
            onClickShow={props.onClickShow}
            classes={classes}
            kind={kind}
            t={t}
          />
        ) : (
          <MultiRecipientStat
            classes={classes}
            t={t}
            campaign={campaign}
            total_read={total_read}
            total_recipients={total_recipients}
            total_click={total_click}
            kind={kind}
            onClickReport={props.onClickReport}
          />
        )}
      </div>
      <Divider className={classes.divider} />
    </div>
  );
};

const styles = (theme) => ({
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
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(CampaignListItem);
