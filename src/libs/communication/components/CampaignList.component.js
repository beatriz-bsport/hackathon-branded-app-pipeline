// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

import CampaignListItem from './CampaignListItem.component';
import type { Campaign } from '../types';

type Props = {
  t: TFunction,
  classes: Object,
  campaignState: Object,
  fetchMore: () => void,
  loading: boolean,
  showEmail: ?string,
  setShowEmail: (?string) => void,
  campaignList: Array<Campaign>,
  onClickReport: (string) => void,
};
export const CampaignList = (props: Props) => {
  return (
    <div className={props.classes.container}>
      {props.campaignList.map(([c, r]) => (
        <CampaignListItem
          campaign={c}
          key={c.id}
          campaignState={props.campaignState}
          onClickReport={() => props.onClickReport(c.uuid)}
          onClickShow={props.setShowEmail}
          singleRecipientData={r}
        />
      ))}
      <div className={props.classes.buttonContainer}>
        {props.fetchMore && !props.loading ? (
          <Button variant="outlined" onClick={props.fetchMore}>
            {props.t('campaign.list.showMore')}
          </Button>
        ) : null}
        {props.loading ? <CircularProgress /> : null}
        {props.campaignList.length === 0 && !props.loading ? (
          <div className={props.classes.column}>
            <InfoIcon className={props.classes.infoIcon} />
            <Typography align="center" color="textSecondary">
              {props.t('campaign.list.isEmpty')}
            </Typography>
          </div>
        ) : null}
      </div>
      <Dialog open={!!props.showEmail}>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: props.showEmail }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setShowEmail(null)}>
            {props.t('common:close')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = (theme) => ({
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
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
  withState('showEmail', 'setShowEmail', null),
)(CampaignList);
