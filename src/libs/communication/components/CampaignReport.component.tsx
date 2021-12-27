// @flow
import React from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import amber from '@material-ui/core/colors/amber';
import { Theme, makeStyles } from '@material-ui/core';
import clx from 'classnames';
import RecipientTable from './RecipientTable.component';
import type { Campaign, Report, Recipient } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  statBanner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: 'white',
    borderRadius: theme.spacing(4),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: theme.spacing(1),
  },
  statLabel: {
    marginTop: theme.spacing(1),
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
    marginRight: theme.spacing(3),
  },
  inlineStat: {
    marginLeft: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  emailUnavailable: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  unAvailable: {
    color: amber[900],
  },
}));

type CampaignStatisticsProps = {
  campaign: Campaign;
  report: Report;
  onShowMail: () => void;
};
const CampaignStatistics = (props: CampaignStatisticsProps) => {
  const { campaign, report, onShowMail } = props;
  const classes = useStyles();
  const { t } = useTranslation('communication');

  return (
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
        {campaign?.data?.body ? (
          <Button color="primary" variant="contained" onClick={onShowMail}>
            <VisibilityIcon className={classes.leftIcon} />
            {t('campaign.showMail')}
          </Button>
        ) : (
          <div className={classes.emailUnavailable}>
            <VisibilityOffIcon
              className={clx({
                [classes.unAvailable]: true,
                [classes.leftIcon]: true,
              })}
            />
            <Typography className={classes.unAvailable}>
              {t('campaign.unavailableMail')}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

type CampaignClickProps = {
  report: Report;
};
const CampaignClick = (props: CampaignClickProps) => {
  const sortedTopLinks = Object.entries(props.report.top_links).sort(
    (linkA, linkB) => linkA[1] - linkB[1],
  );
  const { t } = useTranslation('communication');
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h4" className={classes.title}>
        {t('campaign.report.topLinks')}
      </Typography>
      <Divider className={classes.divider} />
      {sortedTopLinks.length === 0 ? (
        <Typography color="textSecondary">
          {t('campaign.report.noTopLink')}
        </Typography>
      ) : (
        sortedTopLinks.map((link) => (
          <div className={classes.row}>
            <Typography variant="subtitle1">{link[0]}</Typography>
            <Typography variant="h5">{link[1]}</Typography>
          </div>
        ))
      )}
    </div>
  );
};

type Props = {
  campaign: Campaign;
  report: Report;
  fetchRecipientList: (page: number, params: any) => void;
  recipientList: Array<Recipient>;
  recipientState: Object;
  goBack: () => void;
  goToMember: (id: number) => void;
};
export const CampaignReport = (props: Props) => {
  const [showMail, setShowMail] = React.useState<string | null>(null);
  const { t } = useTranslation('communication');
  const classes = useStyles();
  return (
    <div>
      <div className={classes.titleRow}>
        <IconButton onClick={props.goBack} className={classes.backIcon}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography className={classes.title} variant="h2">
          {props.campaign.data.subject}
        </Typography>
      </div>
      <Divider />
      {props.report ? (
        <div>
          <CampaignStatistics
            campaign={props.campaign}
            report={props.report}
            onShowMail={() => setShowMail(props.campaign.data.body)}
          />
          <CampaignClick report={props.report} />
        </div>
      ) : (
        <LinearProgress />
      )}
      <Typography variant="h4" className={classes.title}>
        {t('campaign.report.recipientList')}
      </Typography>
      <Divider className={classes.divider} />
      <RecipientTable
        fetchRecipientList={props.fetchRecipientList}
        recipientList={props.recipientList}
        recipientState={props.recipientState}
        goToMember={props.goToMember}
      />
      <Dialog open={!!showMail}>
        <DialogContent>
          <div
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{ __html: showMail }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMail(null)}>{t('common:close')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default compose<any, Props>(CampaignReport);
