// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import SettingsIcon from '@material-ui/icons/Settings';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import StatsPanel from './StatsPanel.component';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

type Props = {
  t: TFunction,
  smartlist: ?SmartList,
  classes: Object,
  onConfigure: () => void,
  statistics: any,
  changeDateRange: () => void,
  dateRange: Object,
};

export const SmartlistCard = (props: Props) => {
  if (!props.smartlist) {
    return null;
  }
  return (
    <div>
      <div className={props.classes.paper}>
        <Typography variant="h4" className={props.classes.title}>
          {props.smartlist.name}
        </Typography>
        <Divider />
        <TypographyMultiline>{props.smartlist.description}</TypographyMultiline>

        <StatsPanel
          statistics={props.statistics}
          changeDateRange={props.changeDateRange}
          dateRange={props.dateRange}
        />
      </div>
      <div className={props.classes.configureButtonContainer}>
        <Button onClick={props.onConfigure} variant="outlined" color="primary">
          <SettingsIcon className={props.classes.leftIcon} />
          {props.t('smart_list.actions.configure')}
        </Button>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  title: { marginBottom: theme.spacing.unit },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  configureButtonContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(SmartlistCard);
