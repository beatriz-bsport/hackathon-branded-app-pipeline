import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPack } from '#libs/payment-packs/types';
import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
};

const MarketplacePaymentPackOffPeakSchedule: React.FC<Props> = ({
  paymentPack,
}) => {
  const { t } = useTranslation(['marketplace', 'paymentPack', 'datetime']);

  const offPeakSchedule: Record<string, string[][]> = useMemo(() => {
    return JSON.parse(JSON.stringify(paymentPack?.off_peak_schedule ?? {}));
  }, [paymentPack?.off_peak_schedule]);

  const offPeakScheduleMapped = useMemo(() => {
    return Object.entries(offPeakSchedule);
  }, [offPeakSchedule]);

  return (
    !!offPeakScheduleMapped.length && (
      <div>
        {offPeakScheduleMapped.map(
          ([isoWeekday, timeSlots]: [string, string[][]]) => {
            return (
              <div className="bs-off_peak-days-body" key={isoWeekday}>
                {t(`datetime:time.isoWeekdayNumber.${isoWeekday}`)}
                <div className="bs-off_peak-timeSlots-body">
                  {timeSlots.map((timeSlot: string[]) => {
                    const [start, end] = timeSlot;
                    const isAllDaySlot = start === '00:00' && end === '23:59';
                    return (
                      <div>
                        {isAllDaySlot ? (
                          <div
                            key={`${isoWeekday}-all_day`}
                            className="bs-off_peak-all_day"
                          >
                            {t(
                              'paymentPack:addPaymentPack.offPeak.choice.allDay',
                            )}
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
                  })}
                </div>
              </div>
            );
          },
        )}
      </div>
    )
  );
};

export default memo(MarketplacePaymentPackOffPeakSchedule);
