import React, { memo } from 'react';
import { ClassNameMap, makeStyles } from '@material-ui/styles';
import { Theme, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { CustomChip } from '#components/chip/CustomChip.component';

type OffPeakDisplayByDayProps = {
  timeSlots: string[][];
  isoWeekday: string;
};

type OffPeakDisplayByTimeSlotsProps = {
  timeSlot: string[];
  classes: ClassNameMap;
  t: TFunction;
};

const OffPeakDisplayByTimeSlots: React.FC<OffPeakDisplayByTimeSlotsProps> =
  memo(({ timeSlot, classes, t }) => {
    const [start, end] = timeSlot;
    const isAllDaySlot = start === '00:00' && end === '23:59';

    return (
      <div className={classes.scheduleInfo}>
        {isAllDaySlot ? (
          <CustomChip
            displayedValue={t('addPaymentPack.offPeak.choice.allDay')}
            mainColor="#209D82"
          />
        ) : (
          <CustomChip displayedValue={`${start} → ${end}`} />
        )}
      </div>
    );
  });

const OffPeakDisplayByDay = (props: OffPeakDisplayByDayProps) => {
  const { timeSlots, isoWeekday } = props;
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack', 'datetime']);

  return (
    <div
      key={isoWeekday}
      className={classNames(classes.packInfo, classes.header)}
    >
      <Typography color="textSecondary" variant="caption">
        {t(`datetime:time.isoWeekdayNumber.${isoWeekday}`)}
      </Typography>
      <div className={classes.scheduleInfo}>
        {timeSlots.map((timeSlot) => (
          <OffPeakDisplayByTimeSlots
            classes={classes}
            t={t}
            timeSlot={timeSlot}
          />
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  packInfo: {
    marginLeft: theme.spacing(5),
  },
  scheduleInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
}));

export default React.memo(OffPeakDisplayByDay);
