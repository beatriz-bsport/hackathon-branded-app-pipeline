import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import type { ImmutableObject } from 'seamless-immutable';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import type { Link, ActiveCampaignList } from '../types';

type Props = {
  link: ImmutableObject<Link>;
  activeCampaignLists: ActiveCampaignList[];
  onClickEdit: () => void;
  onClickDelete: () => void;
};

export const ActiveCampaignLinkListItem: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');
  if (props.link) {
    const smartlist = props.link.smartlist.name;
    const list =
      props.activeCampaignLists &&
      props.activeCampaignLists.find(
        (item) =>
          parseInt(item.id, 10) ===
          parseInt(props.link.active_campaign_list, 10),
      )
        ? props.activeCampaignLists.find(
            (item) =>
              parseInt(item.id, 10) ===
              parseInt(props.link.active_campaign_list, 10),
          ).name
        : t('active_campaign.link.noList');
    return (
      <ListItem divider className={classes.container}>
        <div className={classes.inlineContainer}>
          <Typography>
            <Trans i18nKey="active_campaign.link.listItemText" t={t}>
              Lier la smartlist <strong>{{ smartlist }}</strong> à la liste
              <strong>
                {{
                  list,
                }}
              </strong>
            </Trans>
          </Typography>
          {list === t('active_campaign.link.noList') ? (
            <WarningIcon className={classes.warningIcon} color="error" />
          ) : null}
        </div>
        <div className={classes.inlineContainer}>
          <IconButton color="primary" onClick={props.onClickEdit}>
            <EditIcon />
          </IconButton>

          <IconButton color="secondary" onClick={props.onClickDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </ListItem>
    );
  }
  return null;
};

const useStyles = makeStyles((theme: Theme) => ({
  warningIcon: { marginLeft: theme.spacing(1) },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inlineContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  b: { fontWeight: 'bold' },
}));

export default ActiveCampaignLinkListItem;
