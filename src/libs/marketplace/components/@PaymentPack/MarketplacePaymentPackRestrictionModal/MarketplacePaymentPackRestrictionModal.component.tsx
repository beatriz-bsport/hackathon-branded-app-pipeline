import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card, { CardSize } from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, { Alignment } from '#components/css-only/Grid/GridItem';

import { PaymentPack } from '#libs/payment-packs/types';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  isOpen: boolean;
  onDialogClose: () => void;
};

const MarketplacePaymentPackRestrictionModal: React.FC<Props> = ({
  paymentPack,
  isOpen,
  onDialogClose,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <>
      {isOpen && (
        <div className="bs-restrictions-modal__backdrop">
          <Card
            classes={{ 'bs-restrictions-modal': 'bs-restrictions-modal' }}
            size={CardSize.L}
          >
            <Content>
              <Grid>
                <Item alignment={Alignment.CENTER} rowStart={1}>
                  <h3 className="bs-restriction-modal__title">
                    {t('genericCardDetails.restrictions')}
                  </h3>
                </Item>
                <Item
                  classes={{
                    'bs-restriction-modal__body': 'bs-restriction-modal__body',
                  }}
                  rowStart={2}
                >
                  <ul className="bs-restriction-modal__list">
                    {!!paymentPack.max_bookings_per_day && (
                      <li className="bs-restriction-modal__list__item">
                        <Trans
                          count={paymentPack.max_bookings_per_day}
                          i18nKey="genericCardDetails.includedElements.restrictions.maxPerDay"
                          t={t}
                        >
                          Maximum usage per day:{' '}
                          <strong>
                            {{ count: paymentPack.max_bookings_per_day }}
                          </strong>
                        </Trans>
                      </li>
                    )}
                    {!!paymentPack.max_bookings_per_week && (
                      <li className="bs-restriction-modal__list__item">
                        <Trans
                          count={paymentPack.max_bookings_per_week}
                          i18nKey="genericCardDetails.includedElements.restrictions.maxPerWeek"
                          t={t}
                        >
                          Maximum usage per week:{' '}
                          <strong>
                            {{ count: paymentPack.max_bookings_per_week }}
                          </strong>
                        </Trans>
                      </li>
                    )}
                    {!!paymentPack.max_bookings_per_month && (
                      <li className="bs-restriction-modal__list__item">
                        <Trans
                          count={paymentPack.max_bookings_per_month}
                          i18nKey="genericCardDetails.includedElements.restrictions.maxPerMonth"
                          t={t}
                        >
                          Maximum usage per month:{' '}
                          <strong>
                            {{ count: paymentPack.max_bookings_per_month }}
                          </strong>
                        </Trans>
                      </li>
                    )}
                  </ul>
                </Item>
                <Item alignment={Alignment.FLEX_END} rowStart={3}>
                  <button
                    className="bs-restriction-modal__button"
                    onClick={onDialogClose}
                    type="button"
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

export const MarketplacePaymentPackRestrictionModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackRestrictionModal);

export default React.memo(MarketplacePaymentPackRestrictionModal);
