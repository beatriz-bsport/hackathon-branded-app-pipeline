// @flow

import React from 'react';

import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  isDisabled: boolean,
  bookingOptionsPending: Array<BookingOption>,
  switchWaitingListFreeze: () => void,
  classes: Object,
  t: TFunction,
};

export const WaitingListControlHeader = (props: Props) => {
  const { t, isDisabled, classes, bookingOptionsPending } = props;
  const nbPending = bookingOptionsPending.length;
  const nbConvertible = bookingOptionsPending.filter(
    (bo) => bo.is_convertible && !bo.booking && !bo.cancelled,
  ).length;
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="caption">
          {props.t('nbConvertible', { nbConvertible })}
        </Typography>
        <Typography variant="caption">
          {props.t('nbPending', { nbPending })}
        </Typography>
        <Button
          className={classes.smallButton}
          onClick={props.switchWaitingListFreeze}
        >
          <PowerSettingsNewIcon className={classes.smallIcon} />
          <Typography
            color={isDisabled ? 'error' : 'inherit'}
            variant="caption"
          >
            {isDisabled ? t('switchToEnable') : t('switchToDisable')}
          </Typography>
        </Button>
      </div>
      <Divider />
    </div>
  );
};

const styles = (theme) => ({
  container: {
    width: '100%',
    background: '#F8F8F8',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  smallIcon: {
    height: 12,
    width: 12,
    marginRight: theme.spacing(1),
  },
  smallButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['waitingList']),
)(WaitingListControlHeader);
