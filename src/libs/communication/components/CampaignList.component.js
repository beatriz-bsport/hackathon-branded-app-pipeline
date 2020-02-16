// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['communication']),
  withStyles(styles),
  withState('showEmail', 'setShowEmail', null),
)(CampaignList);
