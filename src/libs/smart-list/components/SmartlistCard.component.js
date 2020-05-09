// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import Button from '@material-ui/core/Button';

type Props = {
  t: TFunction,
  smartlist: ?SmartList,
  classes: Object,
  onEdit: ?() => void,
  onClickConfigure: (id: number) => void,
  onClickCampaign: (id: number) => void,
};

export const SmartlistCard = (props: Props) => {
  if (!props.smartlist) {
    return null;
  }
  return (
    <div>
      <div className={props.classes.paper}>
        <div className={props.classes.row}>
          <Typography variant="h5" className={props.classes.title}>
            {props.smartlist.name}
          </Typography>
          <IconButton color="primary" onClick={props.onEdit}>
            <EditIcon />
          </IconButton>
        </div>
        <Divider className={props.classes.divider} />
        <Typography variant="subtitle2" className={props.classes.title}>
          {props.t('smart_list.description.label')}
        </Typography>
        <Typography color="textSecondary" className={props.classes.description}>
          {props.smartlist.description ||
            props.t('smart_list.description.isEmpty')}
        </Typography>
      </div>
      <div className={props.classes.configureButtonContainer}>
        {!!props.onClickConfigure && (
          <Button
            variant="contained"
            color="primary"
            className={props.classes.button}
            onClick={() => props.onClickConfigure(props.smartlist.id)}
          >
            <ArrowForwardIcon className={props.classes.leftIcon} />
            {props.t('smart_list.actions.configure')}
          </Button>
        )}
        {!!props.onClickCampaign && (
          <Button
            variant="contained"
            color="secondary"
            className={props.classes.button}
            onClick={() => props.onClickCampaign(props.smartlist.id)}
          >
            <MailIcon className={props.classes.leftIcon} />
            {props.t('smart_list.actions.campaign')}
          </Button>
        )}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  divider: {
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    border: '1px solid rgba(0, 0, 0, 0.54)',
    borderRadius: 8,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  configureButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(SmartlistCard);
