// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import RecipientTable from './RecipientTable.component';

import type { Campaign, Report } from '../types';

type Props = {
  t: TFunction,
  classes: Object,
  campaign: Campaign,
  report: Report,
  fetchRecipientList: (page: number, params: any) => void,
  recipientList: Array<Recipient>,
  recipientState: Object,
  goBack: () => void,
  goToMember: (id: number) => void,
  showMail: ?string,
  setShowMail: (?string) => void,
};

const styles = (theme) => ({
  container: {},
  statBanner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    backgroundColor: 'white',
    borderRadius: theme.spacing.unit * 4,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: theme.spacing.unit,
  },
  statLabel: {
    marginTop: theme.spacing.unit,
  },
  numberCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'baseline',
    alignItems: 'center',
  },
  numberStat: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: theme.spacing.unit * 3,
  },
  inlineStat: {
    marginLeft: theme.spacing.unit * 2,
  },
  title: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const CampaignStatistics = withStyles(styles)(
  ({ t, classes, campaign, report, onShowMail }) => (
    <div>
      <div className={classes.statBanner}>
        <div className={classes.numberCard}>
          <Typography color="primary" variant="h3">
            {campaign.total_read}
          </Typography>
          <Typography className={classes.statLabel}>
            {t('campaign.report.totalRead')}
          </Typography>
        </div>
        <div className={classes.numberCard}>
          <Typography color="secondary" variant="h3">
            {campaign.total_click}
          </Typography>
          <Typography className={classes.statLabel}>
            {t('campaign.report.totalClick')}
          </Typography>
        </div>
      </div>

      <div className={classes.row}>
        <div>
          <div className={classes.numberStat}>
            <Typography>{t('campaign.report.lastOpen')}</Typography>
            <Typography
              color="secondary"
              variant="subtitle2"
              className={classes.inlineStat}
            >
              {report.last_open
                ? moment(report.last_open).format('LLLL')
                : ' - '}
            </Typography>
          </div>
          <div className={classes.numberStat}>
            <Typography>{t('campaign.report.dateCreated')}</Typography>
            <Typography
              className={classes.inlineStat}
              color="secondary"
              variant="subtitle2"
            >
              {moment(campaign.date_created).format('LLLL')}
            </Typography>
          </div>
        </div>
        <Button color="primary" variant="contained" onClick={onShowMail}>
          <VisibilityIcon className={classes.leftIcon} />
          {t('campaign.showMail')}
        </Button>
      </div>
    </div>
  ),
);
const CampaignClick = withNamespaces(['communication'])(
  withStyles(styles)(
    withState('showMore', 'setShowMore', 5)((props) => {
      const sortedTopLinks = Object.entries(props.report.top_links).sort(
        (linkA, linkB) => linkA[1] - linkB[1],
      );
      return (
        <div>
          <Typography variant="h4" className={props.classes.title}>
            {props.t('campaign.report.topLinks')}
          </Typography>
          <Divider className={props.classes.divider} />
          {sortedTopLinks.length === 0 ? (
            <Typography color="textSecondary">
              {props.t('campaign.report.noTopLink')}
            </Typography>
          ) : (
            sortedTopLinks.map((link) => (
              <div className={props.classes.row}>
                <Typography variant="subtitle">{link[0]}</Typography>
                <Typography variant="h5">{link[1]}</Typography>
              </div>
            ))
          )}
        </div>
      );
    }),
  ),
);

export const CampaignReport = (props: Props) => (
  <div>
    <div className={props.classes.titleRow}>
      <IconButton onClick={props.goBack} className={props.classes.backIcon}>
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <Typography className={props.classes.title} variant="h2">
        {props.campaign.data.subject}
      </Typography>
    </div>
    <Divider />
    {props.report ? (
      <div>
        <CampaignStatistics
          campaign={props.campaign}
          report={props.report}
          t={props.t}
          onShowMail={() => props.setShowMail(props.campaign.data.body)}
        />
        <CampaignClick report={props.report} />
      </div>
    ) : (
      <LinearProgress />
    )}
    <Typography variant="h4" className={props.classes.title}>
      {props.t('campaign.report.recipientList')}
    </Typography>
    <Divider className={props.classes.divider} />
    <RecipientTable
      fetchRecipientList={props.fetchRecipientList}
      recipientList={props.recipientList}
      recipientState={props.recipientState}
      goToMember={props.goToMember}
    />
    <Dialog open={!!props.showMail}>
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: props.showMail }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setShowMail(null)}>
          {props.t('common:close')}
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default compose(
  withNamespaces(['communication']),
  withStyles(styles),
  withState('showMail', 'setShowMail', null),
)(CampaignReport);
