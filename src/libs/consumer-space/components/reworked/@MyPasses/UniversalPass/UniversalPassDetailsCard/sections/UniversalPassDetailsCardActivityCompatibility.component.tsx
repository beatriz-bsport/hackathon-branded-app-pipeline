import React, { useMemo } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import moment from 'moment-timezone';

import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import {
  CheckCircle,
  ClockCheck,
  UsersPlus,
  VideoRecorder,
} from '#components/untitledui';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerCardChipList from '#libs/consumer-space/components/reworked/common/ConsumerCardChipList';

import type {
  ConsumerPaymentPackCompatibility,
  DayOfWeekNumber,
  TimeSlot,
} from '#libs/consumer-space/types';
import type { ChipData } from '#libs/consumer-space/components/reworked/common/ConsumerCardChipList/types';

type ActivityChipDataLists = {
  activity: ChipData[];
  category: ChipData[];
  room: ChipData[];
};

type TimeSlotsChipDataLists = Record<DayOfWeekNumber, ChipData[]>;

type Props = {
  activityCompatibilities: ConsumerPaymentPackCompatibility[];
  className?: string;
  isCompatibleWithBookingForGuest: boolean;
  isCompatibleWithVod: boolean;
  timeSlots: TimeSlot[];
};

const CompatibilityMainList: React.FC<
  Pick<
    Props,
    | 'activityCompatibilities'
    | 'isCompatibleWithBookingForGuest'
    | 'isCompatibleWithVod'
    | 'timeSlots'
  >
> = React.memo(
  ({
    activityCompatibilities,
    isCompatibleWithBookingForGuest,
    isCompatibleWithVod,
    timeSlots,
  }) => {
    const { t } = useTranslation('consumerSpace');
    return (
      <List className="bs-universal-pass-details-card__compatibility-section__list">
        <ListItem
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__list__item',
            {
              'bs-universal-pass-details-card__compatibility-section__list__item--hidden':
                !!activityCompatibilities?.length,
            },
          )}
          icon={<CheckCircle stroke="currentColor" />}
          label={t(
            'reworked.myPasses.consumerPassDetailsCard.compatibility.contents.allActivities',
          )}
          size="sm"
        />
        <ListItem
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__list__item',
            {
              'bs-universal-pass-details-card__compatibility-section__list__item--hidden':
                !!timeSlots?.length,
            },
          )}
          icon={<ClockCheck stroke="currentColor" />}
          label={t(
            'reworked.myPasses.consumerPassDetailsCard.compatibility.contents.allTimeSlots',
          )}
          size="sm"
        />
        <ListItem
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__list__item',
            {
              'bs-universal-pass-details-card__compatibility-section__list__item--hidden':
                !isCompatibleWithVod,
            },
          )}
          icon={<VideoRecorder stroke="currentColor" />}
          label={
            <Trans
              i18nKey="reworked.myPasses.consumerPassDetailsCard.compatibility.contents.vod"
              t={t}
            />
          }
          size="sm"
        />
        <ListItem
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__list__item',
            {
              'bs-universal-pass-details-card__compatibility-section__list__item--hidden':
                !isCompatibleWithBookingForGuest,
            },
          )}
          icon={<UsersPlus stroke="currentColor" />}
          label={
            <Trans
              i18nKey="reworked.myPasses.consumerPassDetailsCard.compatibility.contents.bookingForGuest"
              t={t}
            />
          }
          size="sm"
        />
      </List>
    );
  },
);

const CompatiblityChipList: React.FC<{
  chipsDataList: ChipData[];
  title: string;
  variant: string;
}> = React.memo(({ chipsDataList, title, variant }) => (
  <ConsumerCardChipList
    chipsDataList={chipsDataList}
    classes={{
      title: classNames(
        `bs-universal-pass-details-card__compatibility-section__subsection__chip-list__title--${variant}`,
        'bs-universal-pass-details-card__compatibility-section__subsection__chip-list__title',
      ),
      list: classNames(
        `bs-universal-pass-details-card__compatibility-section__subsection__chip-list__list--${variant}`,
        'bs-universal-pass-details-card__compatibility-section__subsection__chip-list__list',
      ),
    }}
    className={classNames(
      `bs-universal-pass-details-card__compatibility-section__subsection__chip-list--${variant}`,
      'bs-universal-pass-details-card__compatibility-section__subsection__chip-list',
    )}
    title={title}
  />
));

const UniversalPassDetailsCardActivityCompatibility: React.FC<Props> = ({
  activityCompatibilities,
  className,
  isCompatibleWithBookingForGuest,
  isCompatibleWithVod,
  timeSlots,
}) => {
  const { t } = useTranslation(['consumerSpace', 'datetime']);

  const activityChipDataLists = useMemo<ActivityChipDataLists>(() => {
    const defaultActivityChipDataLists: ActivityChipDataLists = {
      activity: [],
      category: [],
      room: [],
    };
    return (
      activityCompatibilities?.reduce((acc, compatibility) => {
        return {
          ...acc,
          [compatibility.type]: [
            ...acc[compatibility.type],
            {
              chipColor: 'grey',
              text: compatibility.label,
              chipClassName: classNames(
                'bs-universal-pass-details-card__compatibility-section__subsection__chip',
                `bs-universal-pass-details-card__compatibility-section__subsection__chip--${compatibility.type}`,
              ),
            },
          ],
        };
      }, defaultActivityChipDataLists) ?? defaultActivityChipDataLists
    );
  }, [activityCompatibilities]);

  const hideActivitySection =
    !activityChipDataLists?.activity?.length &&
    !activityChipDataLists?.category?.length &&
    !activityChipDataLists?.room?.length;

  const timeSlotsChipDataLists = useMemo<TimeSlotsChipDataLists>(() => {
    const defaultTimeSlotsChipDataLists: TimeSlotsChipDataLists = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };
    return (
      timeSlots?.reduce((acc, timeSlot) => {
        return {
          ...acc,
          [timeSlot.dayOfWeek]: [
            ...acc[timeSlot.dayOfWeek],
            {
              shouldDisplay: true,
              chipColor: 'grey',
              text: `${moment(timeSlot.from, ['H:m']).format('LT')} to ${moment(
                timeSlot.to,
                ['H:m'],
              ).format('LT')}`,
              chipClassName: classNames(
                'bs-universal-pass-details-card__compatibility-section__subsection__chip',
                `bs-universal-pass-details-card__compatibility-section__subsection__chip--time-slot`,
              ),
            },
          ],
        };
      }, defaultTimeSlotsChipDataLists) ?? defaultTimeSlotsChipDataLists
    );
  }, [timeSlots]);

  const hideTimeSlotsSection =
    !timeSlotsChipDataLists?.[0]?.length &&
    !timeSlotsChipDataLists?.[1]?.length &&
    !timeSlotsChipDataLists?.[2]?.length &&
    !timeSlotsChipDataLists?.[3]?.length &&
    !timeSlotsChipDataLists?.[4]?.length &&
    !timeSlotsChipDataLists?.[5]?.length &&
    !timeSlotsChipDataLists?.[6]?.length;

  return (
    <div className={classNames(className)}>
      <CompatibilityMainList
        activityCompatibilities={activityCompatibilities}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        timeSlots={timeSlots}
      />
      <ConsumerCardSection
        className={classNames(
          'bs-universal-pass-details-card__compatibility-section__subsection--activity',
          'bs-universal-pass-details-card__compatibility-section__subsection',
          {
            'bs-universal-pass-details-card__compatibility-section__subsection--hidden':
              hideActivitySection,
          },
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.subtitles.activity',
        )}
        titleVariant="body-md"
      >
        <div
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__subsection__container--activity',
            'bs-universal-pass-details-card__compatibility-section__subsection__container',
          )}
        >
          <CompatiblityChipList
            chipsDataList={activityChipDataLists?.activity || []}
            title={t(
              'reworked.myPasses.consumerPassDetailsCard.compatibility.labels.activity',
            )}
            variant="activity"
          />
          <CompatiblityChipList
            chipsDataList={activityChipDataLists?.category || []}
            title={t(
              'reworked.myPasses.consumerPassDetailsCard.compatibility.labels.category',
            )}
            variant="category"
          />
          <CompatiblityChipList
            chipsDataList={activityChipDataLists?.room || []}
            title={t(
              'reworked.myPasses.consumerPassDetailsCard.compatibility.labels.room',
            )}
            variant="room"
          />
        </div>
      </ConsumerCardSection>
      <ConsumerCardSection
        className={classNames(
          'bs-universal-pass-details-card__compatibility-section__subsection--time-slot',
          'bs-universal-pass-details-card__compatibility-section__subsection',
          {
            'bs-universal-pass-details-card__compatibility-section__subsection--hidden':
              hideTimeSlotsSection,
          },
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.subtitles.timeSlots',
        )}
        titleVariant="body-md"
      >
        <div
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__subsection__container--activity',
            'bs-universal-pass-details-card__compatibility-section__subsection__container',
          )}
        >
          {(Object.keys(timeSlotsChipDataLists) ?? []).map((dayOfWeek) => (
            <CompatiblityChipList
              key={dayOfWeek}
              chipsDataList={
                timeSlotsChipDataLists?.[
                  parseInt(dayOfWeek) as keyof TimeSlotsChipDataLists
                ] || []
              }
              title={t(`datetime:time.weekdayNumber.${dayOfWeek}`)}
              variant="time-slot"
            />
          ))}
        </div>
      </ConsumerCardSection>
    </div>
  );
};

export default React.memo(UniversalPassDetailsCardActivityCompatibility);
