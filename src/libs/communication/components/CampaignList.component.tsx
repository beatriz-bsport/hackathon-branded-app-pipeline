// @ts-nocheck
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert/Alert';
import { makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { ImmutableArray } from 'seamless-immutable';
import CampaignListItem from './CampaignListItem.component';
import type { Campaign, Recipient } from '../types';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import { CommunicationSentGroup } from '#libs/communication/types';

type Props = {
  loading: boolean;
  campaignList: ImmutableArray<CommunicationSentGroup | Campaign, Recipient>;
  fetchMore: () => void;
  onClickReport: (campaign_uuid: string) => void;
  resolvedGenericTags: ResolvedGenericTags;
};

export const CampaignList: React.FC<Props> = ({
  loading,
  campaignList,
  fetchMore,
  onClickReport,
  resolvedGenericTags,
}) => {
  const { t } = useTranslation(['communication']);
  const classes = useStyles();
  const [showEmail, setShowEmail] = useState(null);

  const handleOnClickReport = useCallback(
    (campaign) => () => onClickReport(campaign.uuid ?? campaign.id),
    [onClickReport],
  );

  return (
    <div className={classes.container}>
      {campaignList.map(([campaignItem, recipient]) => (
        <CampaignListItem
          key={campaignItem.uuid}
          campaign={campaignItem}
          onClickReport={handleOnClickReport(campaignItem)}
          onClickShow={setShowEmail}
          singleRecipientData={recipient}
        />
      ))}
      <div className={classes.buttonContainer}>
        {loading && <CircularProgress />}
        {!loading && fetchMore && (
          <Button onClick={fetchMore} variant="outlined">
            {t('campaign.list.showMore')}
          </Button>
        )}
        {!loading && campaignList.length === 0 && (
          <div className={classes.column}>
            <Alert className={classes.alertInfo} color="grey" severity="info">
              {t('campaign.list.isEmpty')}
            </Alert>
          </div>
        )}
      </div>
      <HTMLPreviewDialog
        html={showEmail}
        onClose={() => setShowEmail(null)}
        open={!!showEmail}
        resolvedGenericTags={resolvedGenericTags}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '100%',
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

export default React.memo(CampaignList);
