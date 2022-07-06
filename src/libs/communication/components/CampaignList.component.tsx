import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import CampaignListItem from './CampaignListItem.component';
import type { Campaign, Recipient } from '../types';

type Props = {
  loading: boolean;
  campaignList: [Campaign, Recipient][];
  fetchMore: () => void;
  onClickReport: (campaign_uuid: string) => void;
};

export const CampaignList: React.FC<Props> = ({
  loading,
  campaignList,
  fetchMore,
  onClickReport,
}) => {
  const { t } = useTranslation(['communication']);
  const classes = useStyles();
  const [showEmail, setShowEmail] = useState(null);

  return (
    <div className={classes.container}>
      {campaignList.map(([c, r]) => (
        <CampaignListItem
          campaign={c}
          key={c.uuid}
          onClickReport={() => onClickReport(c.uuid)}
          onClickShow={setShowEmail}
          singleRecipientData={r}
        />
      ))}
      <div className={classes.buttonContainer}>
        {loading && <CircularProgress />}
        {!loading && fetchMore && (
          <Button variant="outlined" onClick={fetchMore}>
            {t('campaign.list.showMore')}
          </Button>
        )}
        {!loading && campaignList.length === 0 && (
          <div className={classes.column}>
            <InfoIcon className={classes.infoIcon} />
            <Typography align="center" color="textSecondary">
              {t('campaign.list.isEmpty')}
            </Typography>
          </div>
        )}
      </div>
      <GenericResponsiveDialog open={!!showEmail}>
        <DialogContent>
          <div
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{ __html: showEmail }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmail(null)}>
            {t('common:close')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
  },
  infoIcon: {
    height: 120,
    width: 120,
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  column: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default CampaignList;
