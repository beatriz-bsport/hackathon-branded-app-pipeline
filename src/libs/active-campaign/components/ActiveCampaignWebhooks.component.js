// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';

import HelpIcon from '@material-ui/icons/Help';

type Props = {
  t: TFunction,
  webhooks: any,
  handleWebhookActive: (string) => void,
  webhookLoading: boolean,
  classes: Object,
  onClickInfo: () => void,
};

export function ActiveCampaignWebhooks(props: Props) {
  return (
    <div>
      <div className={props.classes.inline}>
        <Typography variant="h5">
          {props.t('active_campaign.webhooks.title')}
        </Typography>
        <IconButton onClick={props.onClickInfo}>
          <HelpIcon />
        </IconButton>
      </div>
      <Paper>
        <ListItem divider>
          {props.webhookLoading === 'CLIENT_WON' ||
          (props.webhooks.loading && !props.webhookLoading) ? (
            <CircularProgress className={props.classes.circularProgress} />
          ) : (
            <Switch
              checked={
                !!props.webhooks.items.find(
                  (webhook) => webhook.name === 'CLIENT_WON',
                )
              }
              onChange={() => props.handleWebhookActive('CLIENT_WON')}
              value="CLIENT_WON"
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          )}
          <ListItemText
            primary={props.t('active_campaign.webhooks.CLIENT_WON')}
          />
        </ListItem>
        <ListItem>
          {props.webhookLoading === 'CONTACT_TAG' ||
          (props.webhooks.loading && !props.webhookLoading) ? (
            <CircularProgress className={props.classes.circularProgress} />
          ) : (
            <Switch
              checked={
                !!props.webhooks.items.find(
                  (webhook) => webhook.name === 'CONTACT_TAG',
                )
              }
              onChange={() => props.handleWebhookActive('CONTACT_TAG')}
              value="CONTACT_TAG"
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          )}
          <ListItemText
            primary={props.t('active_campaign.webhooks.CONTACT_TAG')}
          />
        </ListItem>
      </Paper>
    </div>
  );
}

const styles = (theme) => ({
  inline: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  circularProgress: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['settings']),
)(ActiveCampaignWebhooks);
