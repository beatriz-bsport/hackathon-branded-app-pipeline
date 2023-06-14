import React from 'react';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card, { CardSize } from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, { Alignment } from '#components/css-only/Grid/GridItem';

import './styles.css';
import { PaymentPack } from '#libs/payment-packs/types';

export type Props = {
  paymentPack: PaymentPack;
  isOpen: boolean;
  onDialogClose: () => void;
};

const MarketplacePaymentPackOffPeakRestrictionModal: React.FC<Props> = ({
  paymentPack,
  isOpen,
  onDialogClose,
}) => {
  const { t } = useTranslation(['marketplace', 'paymentPack', 'datetime']);
  let offPeakSchedule = {};
  paymentPack
    ? (offPeakSchedule = JSON.parse(
        JSON.stringify(paymentPack?.off_peak_schedule),
      ) as Record<string, string[]>)
    : (offPeakSchedule = {});

  return (
    <>
      {isOpen && (
        <div className="bs-off_peak-modal__backdrop">
          <Card
            size={CardSize.L}
            classes={{ 'bs-off_peak-modal': 'bs-off_peak-modal' }}
          >
            <Content>
              <Grid>
                <Item rowStart={1} alignment={Alignment.CENTER}>
                  <div className="bs-off_peak-clock-icon-background">
                    <AccessTimeIcon className="bss-off_peak_clock-icon" />
                  </div>
                  <h3 className="bs-off_peak-modal__title">
                    {t('genericCardDetails.compatibleTimeSlot')}
                  </h3>
                </Item>
                <Item
                  rowStart={2}
                  classes={{
                    'bs-off_peak-modal__body': 'bs-off_peak-modal__body',
                  }}
                >
                  {!!Object.keys(offPeakSchedule).length && (
                    <div>
                      {Object.entries(offPeakSchedule).map(
                        ([isoWeekday, timeSlots]: [string, string[][]]) => {
                          return (
                            <div
                              className="bs-off_peak-days-body"
                              key={isoWeekday}
                            >
                              {t(
                                `datetime:time.isoWeekdayNumber.${isoWeekday}`,
                              )}
                              <div className="bs-off_peak-timeSlots-body">
                                {timeSlots.map((timeSlot: string[]) => {
                                  const [start, end] = timeSlot;
                                  const isAllDaySlot =
                                    start === '00:00' && end === '23:59';
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
                  )}
                </Item>
                <Item alignment={Alignment.CENTER} rowStart={3}>
                  <button
                    className="bs-restriction-modal__button"
                    type="button"
                    onClick={onDialogClose}
                  >
                    {t('genericCardDetails.compatibility.button.close')}
                  </button>
                </Item>
              </Grid>
            </Content>
          </Card>
        </div>
      )}
    </>
  );
};

export const MarketplacePaymentPackOffPeakRestrictionModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackOffPeakRestrictionModal);

export default React.memo(MarketplacePaymentPackOffPeakRestrictionModal);
