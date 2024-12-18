import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import Typography from '@material-ui/core/Typography';

import HelpIcon from '@material-ui/icons/Help';

import { Theme, makeStyles } from '@material-ui/core';
import ActiveCampaignLinkListItem from './ActiveCampaignLinkListItem.component';
import type { Link, ActiveCampaignList } from '../types';

type Props = {
  links: ImmutableArray<Link>;
  loading: boolean;
  onClickEdit: (link: ImmutableObject<Link>) => void;
  onClickAdd: () => void;
  onClickInfo: () => void;
  onClickDelete: (id: number) => void;
  activeCampaignLists: ActiveCampaignList[];
  disabled: boolean;
};

export const ActiveCampaignLinks: React.FC<Props> = (props) => {
  const { t } = useTranslation('settings');
  const classes = useStyles();
  return (
    <div>
      <div className={classes.inline}>
        <Typography variant="h5">{t('active_campaign.link.title')}</Typography>
        <IconButton onClick={props.onClickInfo}>
          <HelpIcon />
        </IconButton>
      </div>
      {props.loading ? <LinearProgress /> : null}
      <Paper>
        {props.links.map((link) => (
          <ActiveCampaignLinkListItem
            activeCampaignLists={props.activeCampaignLists}
            link={link}
            onClickDelete={() => props.onClickDelete(link.id)}
            onClickEdit={() => props.onClickEdit(link)}
          />
        ))}
      </Paper>
      <div className={classes.addButtonContainer}>
        <Button
          className={classes.addButton}
          color="primary"
          disabled={props.disabled}
          onClick={() => props.onClickAdd()}
          variant="outlined"
        >
          <AddIcon />
          {t('active_campaign.link.add')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  inline: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(1),
  },
  addButtonContainer: { display: 'flex', justifyContent: 'start' },
}));

export default ActiveCampaignLinks;
