import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPack } from '#src/libs/payment-packs/types';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
};

export type MarketplaceOffPeakDisplayByDayProps = {
  timeSlots: string[][];
  isoWeekday: string;
};

export type MarketplaceOffPeakDisplayByTimeSlotsProps = {
  timeSlot: string[];
  isoWeekday: string;
};

const MarketplacePaymentPackOffPeakSchedule: React.FC<Props> = ({
  paymentPack,
}) => {
  const offPeakSchedule: Record<string, string[][]> = useMemo(() => {
    return JSON.parse(JSON.stringify(paymentPack?.off_peak_schedule ?? {}));
  }, [paymentPack?.off_peak_schedule]);

  const offPeakScheduleMapped = useMemo(() => {
    return Object.entries(offPeakSchedule);
  }, [offPeakSchedule]);

  return (
    !!offPeakScheduleMapped.length && (
      <div>
        {offPeakScheduleMapped.map(([isoWeekday, timeSlots], index) => {
          return (
            <MarketplaceOffPeakDisplayByDay
              key={`${isoWeekday}-${index}`}
              isoWeekday={isoWeekday}
              timeSlots={timeSlots}
            />
          );
        })}
      </div>
    )
  );
};

const MarketplaceOffPeakDisplayByDay: React.FC<MarketplaceOffPeakDisplayByDayProps> =
  memo(({ timeSlots, isoWeekday }) => {
    const { t } = useTranslation(['datetime']);

    return (
      <div key={isoWeekday} className="bs-off_peak-days-body">
        {t(`datetime:time.isoWeekdayNumber.${isoWeekday}`)}
        <div className="bs-off_peak-timeSlots-body">
          {timeSlots.map((timeSlot: string[]) => {
            return (
              <MarketplaceOffPeakDisplayByTimeslot
                key={`${timeSlots}-${isoWeekday}`}
                isoWeekday={isoWeekday}
                timeSlot={timeSlot}
              />
            );
          })}
        </div>
      </div>
    );
  });

const MarketplaceOffPeakDisplayByTimeslot: React.FC<MarketplaceOffPeakDisplayByTimeSlotsProps> =
  memo(({ timeSlot, isoWeekday }) => {
    const { t } = useTranslation(['paymentPack']);
    const [start, end] = timeSlot;
    const isAllDaySlot = start === '00:00' && end === '23:59';

    return (
      <div>
        {isAllDaySlot ? (
          <div key={`${isoWeekday}-all_day`} className="bs-off_peak-all_day">
            {t('paymentPack:addPaymentPack.offPeak.choice.allDay')}
          </div>
        ) : (
          <div
            key={`${isoWeekday}-${start}-${end}`}
            className="bs-off_peak-timeSlot"
          >
            {start} → {end}
          </div>
        )}
      </div>
    );
  });

export default memo(MarketplacePaymentPackOffPeakSchedule);
