import React from 'react';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';

import HelpIcon from '@material-ui/icons/Help';
import { Theme, makeStyles } from '@material-ui/core';
import type { WebhookState } from '../types';

type Props = {
  webhooks: WebhookState;
  handleWebhookActive: (text: string) => void;
  webhookLoading: string;
  onClickInfo: () => void;
  disabled: boolean;
};

export const ActiveCampaignWebhooks: React.FC<Props> = (props) => {
  const { t } = useTranslation('settings');
  const classes = useStyles();
  return (
    <div>
      <div className={classes.inline}>
        <Typography variant="h5">
          {t('active_campaign.webhooks.title')}
        </Typography>
        <IconButton onClick={props.onClickInfo}>
          <HelpIcon />
        </IconButton>
      </div>
      <Paper>
        <ListItem divider>
          {props.webhookLoading === 'CLIENT_WON' ||
          (props.webhooks.loading && !props.webhookLoading) ? (
            <CircularProgress className={classes.circularProgress} />
          ) : (
            <Switch
              checked={
                !!props.webhooks.items.find(
                  (webhook) => webhook.name === 'CLIENT_WON',
                )
              }
              color="primary"
              disabled={props.disabled}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              onChange={() => props.handleWebhookActive('CLIENT_WON')}
              value="CLIENT_WON"
            />
          )}
          <ListItemText
            primary={t('active_campaign.webhooks.CLIENT_WON')}
            primaryTypographyProps={{
              color: props.disabled ? 'textPrimary' : 'textSecondary',
            }}
          />
        </ListItem>
        <ListItem>
          {props.webhookLoading === 'CONTACT_TAG' ||
          (props.webhooks.loading && !props.webhookLoading) ? (
            <CircularProgress className={classes.circularProgress} />
          ) : (
            <Switch
              checked={
                !!props.webhooks.items.find(
                  (webhook) => webhook.name === 'CONTACT_TAG',
                )
              }
              color="primary"
              disabled={props.disabled}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              onChange={() => props.handleWebhookActive('CONTACT_TAG')}
              value="CONTACT_TAG"
            />
          )}
          <ListItemText
            primary={t('active_campaign.webhooks.CONTACT_TAG')}
            primaryTypographyProps={{
              color: props.disabled ? 'textPrimary' : 'textSecondary',
            }}
          />
        </ListItem>
      </Paper>
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
  circularProgress: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

export default ActiveCampaignWebhooks;
