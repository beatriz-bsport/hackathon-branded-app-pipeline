import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { useSlotCalendarNavigation } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';

const SlotCalendarToolBar: React.FC = () => {
  const { selectedPrivateSlot } = useContext(SlotSelectorContext);
  const classes = useStyles({ disabled: !selectedPrivateSlot });
  const { t } = useTranslation('privateService');

  const { selectPreviousDate, selectNextDate } = useSlotCalendarNavigation();

  return (
    <div className={classes.calendarToolbar}>
      <IconButton
        aria-label="left"
        disabled={!selectedPrivateSlot}
        onClick={selectPreviousDate}
      >
        <ChevronLeftIcon fontSize="large" />
      </IconButton>

      <Typography
        color={selectedPrivateSlot ? 'primary' : 'textSecondary'}
        variant="h6"
      >
        {t('service.detail.tab.calendar')}
      </Typography>

      <IconButton
        aria-label="left"
        disabled={!selectedPrivateSlot}
        onClick={selectNextDate}
      >
        <ChevronRightIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  calendarToolbar: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default React.memo(SlotCalendarToolBar);
