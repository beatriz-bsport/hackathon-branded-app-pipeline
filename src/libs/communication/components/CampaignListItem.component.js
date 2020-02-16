// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import moment from 'moment';
import MailIcon from '@material-ui/icons/Mail';
import Divider from '@material-ui/core/Divider';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

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
}) => (
  <React.Fragment>
    <div className={props.classes.counters}>
      <Typography variant="subtitle2">
        {`${((props.total_read / props.total_recipients) * 100).toFixed(1)}%`}
      </Typography>
      <Typography color="textSecondary">
        {props.t('campaign.readCount')}
      </Typography>
    </div>
    <div className={props.classes.counters}>
      <Typography variant="subtitle2">
        {`${((props.total_click / props.total_recipients) * 100).toFixed(1)}%`}
      </Typography>
      <Typography color="textSecondary">
        {props.t('campaign.clickCount')}
      </Typography>
    </div>
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
  onClickShow: (body: string) => void,
}) => (
  <React.Fragment>
    <div className={props.classes.counter}>
      <Typography variant="subtitle2">{props.recipient.read_count}</Typography>
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
    <Button
      onClick={() => props.onClickShow(props.body)}
      variant="outlined"
      className={props.classes.button}
    >
      <VisibilityOnIcon className={props.classes.leftIcon} />
      {props.t('recipient.showEmail')}
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
  } = campaign;

  const { subject, body } = data;
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.firstLeftPanel}>
          <MailIcon className={classes.mailIcon} />
          <div className={classes.leftPanel}>
            <Typography variant="h6" color="primary">
              {subject}
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
        {props.singleRecipientData ? (
          <SingleRecipientInfo
            recipient={props.singleRecipientData}
            body={body}
            onClickShow={props.onClickShow}
            classes={classes}
            t={t}
          />
        ) : (
          <MultiRecipientStat
            classes={classes}
            t={t}
            total_read={total_read}
            total_recipients={total_recipients}
            total_click={total_click}
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
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  mailIcon: {
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit / 2,
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  counters: {
    marginTop: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['communication']),
  withStyles(styles),
)(CampaignListItem);
