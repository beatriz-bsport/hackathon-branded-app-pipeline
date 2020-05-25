// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { compose } from 'recompose';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';

import HelpIcon from '@material-ui/icons/Help';

import ActiveCampaignLinkListItem from './ActiveCampaignLinkListItem.component';

type Props = {
  t: TFunction,
  links: any,
  loading: boolean,
  classes: Object,
  onClickEdit: (link) => void,
  onClickAdd: () => void,
  onClickInfo: () => void,

  onClickDelete: (id: number) => void,
  activeCampaignLists: any,
};

export function ActiveCampaignWebhooks(props: Props) {
  return (
    <div>
      <div className={props.classes.inline}>
        <Typography variant="h5">
          {props.t('active_campaign.link.title')}
        </Typography>
        <IconButton onClick={props.onClickInfo}>
          <HelpIcon />
        </IconButton>
      </div>
      {props.loading ? <LinearProgress /> : null}
      <Paper>
        {props.links.map((link) => (
          <ActiveCampaignLinkListItem
            link={link}
            activeCampaignLists={props.activeCampaignLists}
            onClickEdit={() => props.onClickEdit(link)}
            onClickDelete={() => props.onClickDelete(link.id)}
          />
        ))}
      </Paper>
      <div className={props.classes.addButtonContainer}>
        <Button
          onClick={() => props.onClickAdd()}
          variant="outlined"
          className={props.classes.addButton}
          color="primary"
        >
          <AddIcon />
          {props.t('active_campaign.link.add')}
        </Button>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  inline: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  addButton: { marginTop: theme.spacing(1) },
  addButtonContainer: { display: 'flex', justifyContent: 'center' },
});

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
)(ActiveCampaignWebhooks);
