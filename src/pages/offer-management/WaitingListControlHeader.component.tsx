import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { BookingOption } from '#src/libs/booking/types';

type Props = {
  isDisabled: boolean;
  bookingOptionsPending: BookingOption[];
  switchWaitingListFreeze: () => void;
};

export const WaitingListControlHeader: React.FC<Props> = ({
  isDisabled,
  bookingOptionsPending,
  switchWaitingListFreeze,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('waitingList');

  const nbPending = React.useMemo(
    () =>
      bookingOptionsPending?.filter(
        (option: BookingOption) => !option.cancelled && !option.booking,
      )?.length ?? 0,
    [bookingOptionsPending],
  );

  const nbConvertible = React.useMemo(
    () =>
      bookingOptionsPending?.filter(
        (option: BookingOption) =>
          option.is_convertible && !option.booking && !option.cancelled,
      )?.length ?? 0,
    [bookingOptionsPending],
  );
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="caption">
          {t('nbConvertible', { nbConvertible })}
        </Typography>
        <Typography variant="caption">
          {t('nbPending', { nbPending })}
        </Typography>
        <Button
          className={classes.smallButton}
          onClick={switchWaitingListFreeze}
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

const useStyles = makeStyles((theme) => ({
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
}));

export default React.memo(WaitingListControlHeader);
