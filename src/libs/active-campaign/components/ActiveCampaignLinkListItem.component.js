// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { withNamespaces, Trans } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose } from 'recompose';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

type Props = {
  link: any,
  classes: Object,
  t: TFunction,
  activeCampaignLists: Array<any>,
  onClickEdit: () => void,
  onClickDelete: () => void,
};

export const ActiveCampaignLinkItem = (props: Props) => {
  if (props.link) {
    const smartlist = props.link.smartlist.name;
    const list =
      props.activeCampaignLists &&
      props.activeCampaignLists.find(
        (item) => item.id === props.link.active_campaign_list,
      )
        ? props.activeCampaignLists.find(
            (item) => item.id === props.link.active_campaign_list,
          ).name
        : props.t('active_campaign.link.noList');
    return (
      <ListItem className={props.classes.container} divider>
        <div className={props.classes.inlineContainer}>
          <Typography>
            <Trans i18nKey="active_campaign.link.listItemText">
              Lier la smartlist <strong>{{ smartlist }}</strong> à la liste
              <strong>
                {{
                  list,
                }}
              </strong>
            </Trans>
          </Typography>
          {list === props.t('active_campaign.link.noList') ? (
            <WarningIcon color="error" className={props.classes.warningIcon} />
          ) : null}
        </div>
        <div className={props.classes.inlineContainer}>
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

const styles = (theme) => ({
  warningIcon: { marginLeft: theme.spacing.unit },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inlineContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  b: { fontWeight: 'bold' },
});

export default compose(
  withStyles(styles),
  withNamespaces(['settings']),
)(ActiveCampaignLinkItem);
