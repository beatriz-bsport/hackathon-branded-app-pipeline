// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import RedButton from '../../components/button/RedButton.component';
import { disconnect } from '../../actions/auth.actions';

type Props = {
  t: TFunction,
  disconnect: () => void,
  backToBackoffice: () => void,
  classes: Object,
};
export const MarketplaceAsManager = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <div className={props.classes.innerContainer}>
        <WarningIcon fontSize="large" className={props.classes.icon} />
        <Typography
          align="center"
          color="textSecondary"
          className={props.classes.explainText}
        >
          {props.t('warning.isManager')}
        </Typography>
        <div className={props.classes.buttonContainer}>
          <RedButton
            className={props.classes.button}
            onClick={props.disconnect}
            variant="outlined"
          >
            {props.t('warning.disconnect')}
          </RedButton>
          <Button
            className={props.classes.button}
            onClick={props.backToBackoffice}
            variant="outlined"
          >
            {props.t('warning.backToBackoffice')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    padding: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100vw',
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    backgroundColor: '#F5F5F5',
    maxWidth: 600,
  },
  icon: {
    width: 100,
    height: 100,
  },
  button: {
    margin: theme.spacing(1),
  },
  explainText: {
    padding: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['marketplace']),
  withStyles(styles),
  connect(
    null,
    {
      disconnect,
      backToBackoffice: () => push('/'),
    },
  ),
)(MarketplaceAsManager);
