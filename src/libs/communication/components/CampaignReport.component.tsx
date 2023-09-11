import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import amber from '@material-ui/core/colors/amber';
import { Theme, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// @ts-expect-error
import RecipientTable from './RecipientTable.component';
import type { Campaign, Report, Recipient } from '../types';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';
import { OptionCallback } from '../../../state/types';

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
  exportButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(3),
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  numberCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'baseline',
    alignItems: 'center',
  },
  numberStat: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  borderLeftContainer: {
    borderLeftStyle: 'solid',
    borderLeftWidth: '2px',
    borderLeftColor: '#000000',
    paddingLeft: theme.spacing(1),
  },
  statContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },
  visibilityButtonContainer: {
    gridColumn: '1 / span 4',
    [theme.breakpoints.down('md')]: {
      gridColumn: '1 / span 2',
    },
    [theme.breakpoints.down('xs')]: {
      gridColumn: '1 / 2',
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: theme.spacing(3),
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
    width: 'min-content',
    whiteSpace: 'nowrap',
  },
  unAvailable: {
    color: amber[900],
  },
}));

type CampaignStatisticsProps = {
  campaign: Campaign;
  report: Report;
  onShowMail: () => void;
  generateExportLink: (options?: OptionCallback<string>) => void;
};

const CampaignStatistics: React.FC<CampaignStatisticsProps> = React.memo(
  ({ campaign, report, onShowMail, generateExportLink }) => {
    const classes = useStyles();
    const { t } = useTranslation('communication');

    const [isSmartListExporting, setIsSmartListExporting] = useState(false);

    const handleExportReport = useCallback(() => {
      setIsSmartListExporting(true);
      generateExportLink({
        onSuccess: (campaignXlsxExportLink) => {
          window.open(campaignXlsxExportLink);
          setIsSmartListExporting(false);
        },
        onError: () => {
          setIsSmartListExporting(false);
        },
      });
    }, [generateExportLink]);

    return (
      <div>
        <div>
          <div className={classes.exportButtonContainer}>
            <Button
              color="secondary"
              disabled={isSmartListExporting}
              onClick={handleExportReport}
              variant="contained"
            >
              {isSmartListExporting ? (
                <CircularProgress
                  className={classes.leftIcon}
                  color="inherit"
                  size={25}
                />
              ) : (
                <CloudDownloadIcon className={classes.leftIcon} />
              )}
              {t('campaign.report.exportCampaign')}
            </Button>
          </div>
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
        </div>

        <div className={classes.statContainer}>
          <div className={classes.visibilityButtonContainer}>
            {campaign?.data?.body ? (
              <Button color="primary" onClick={onShowMail} variant="contained">
                <VisibilityIcon className={classes.leftIcon} />
                {t('campaign.showMail')}
              </Button>
            ) : (
              <div className={classes.emailUnavailable}>
                <VisibilityOffIcon
                  className={classNames({
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

          <div className={classes.numberStat}>
            <Typography>{t('campaign.report.lastOpen')}</Typography>
            <Typography color="secondary" variant="subtitle2">
              {report.last_open
                ? formatAsDatetimeAdapted(report.last_open, 'LLLL')
                : ' - '}
            </Typography>
          </div>
          <div className={classes.numberStat}>
            <Typography>{t('campaign.report.dateCreated')}</Typography>
            <Typography color="secondary" variant="subtitle2">
              {formatAsDatetimeAdapted(campaign.date_created, 'LLLL')}
            </Typography>
          </div>

          <div className={classes.numberStat}>
            <Typography>{t('campaign.report.resentOn')}</Typography>
            <div className={classes.borderLeftContainer}>
              {report.resent_on.length ? (
                report.resent_on.map((date: string) => (
                  <Typography key={date} color="secondary" variant="subtitle2">
                    {formatAsDatetimeAdapted(date, 'LLLL')}
                  </Typography>
                ))
              ) : (
                <Typography>{' - '}</Typography>
              )}
            </div>
          </div>

          <div className={classes.numberStat}>
            <Typography>{t('campaign.report.plannedResends')}</Typography>
            <div className={classes.borderLeftContainer}>
              {report.planned_resends.length ? (
                report.planned_resends.map((date: string) => (
                  <Typography key={date} color="secondary" variant="subtitle2">
                    {formatAsDatetimeAdapted(date, 'LLLL')}
                  </Typography>
                ))
              ) : (
                <Typography>{' - '}</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

type CampaignClickProps = {
  report: Report;
};
const CampaignClick: React.FC<CampaignClickProps> = React.memo((props) => {
  const sortedTopLinks = Object.entries(props.report.top_links).sort(
    (linkA, linkB) => linkA[1] - linkB[1],
  );
  const { t } = useTranslation('communication');
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.title} variant="h4">
        {t('campaign.report.topLinks')}
      </Typography>
      <Divider className={classes.divider} />
      {sortedTopLinks.length === 0 ? (
        <Typography color="textSecondary">
          {t('campaign.report.noTopLink')}
        </Typography>
      ) : (
        sortedTopLinks.map((link) => (
          <div key={`${link[0]}:${link[1]}`} className={classes.row}>
            <Typography variant="subtitle1">{link[0]}</Typography>
            <Typography variant="h5">{link[1]}</Typography>
          </div>
        ))
      )}
    </div>
  );
});

type Props = {
  campaign: Campaign;
  report: Report;
  fetchRecipientList: (page: number, params: any) => void;
  recipientList: Array<Recipient>;
  recipientState: Object;
  goBack: () => void;
  goToMember: (id: number) => void;
  resolvedGenericTags: ResolvedGenericTags;
  generateExportLink: (options?: OptionCallback<string>) => void;
};
export const CampaignReport: React.FC<Props> = (props) => {
  const [showMail, setShowMail] = React.useState<string | null>(null);
  const { t } = useTranslation('communication');
  const classes = useStyles();
  return (
    <div>
      <div className={classes.titleRow}>
        <IconButton className={classes.backIcon} onClick={props.goBack}>
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
            generateExportLink={props.generateExportLink}
            onShowMail={() => setShowMail(props.campaign.data.body)}
            report={props.report}
          />
          <CampaignClick report={props.report} />
        </div>
      ) : (
        <LinearProgress />
      )}
      <Typography className={classes.title} variant="h4">
        {t('campaign.report.recipientList')}
      </Typography>
      <Divider className={classes.divider} />
      <RecipientTable
        fetchRecipientList={props.fetchRecipientList}
        goToMember={props.goToMember}
        recipientList={props.recipientList}
        recipientState={props.recipientState}
      />
      <HTMLPreviewDialog
        html={showMail}
        onClose={() => setShowMail(null)}
        open={!!showMail}
        resolvedGenericTags={props.resolvedGenericTags}
      />
    </div>
  );
};

export default React.memo(CampaignReport);
