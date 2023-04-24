// @ts-nocheck
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { compose } from 'recompose';

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
            size={CardSize.L}
            classes={{ 'bs-restrictions-modal': 'bs-restrictions-modal' }}
          >
            <Content>
              <Grid>
                <Item rowStart={1} alignment={Alignment.CENTER}>
                  <h3 className="bs-restriction-modal__title">
                    {t('genericCardDetails.restrictions')}
                  </h3>
                </Item>
                <Item
                  rowStart={2}
                  classes={{
                    'bs-restriction-modal__body': 'bs-restriction-modal__body',
                  }}
                >
                  <ul className="bs-restriction-modal__list">
                    {!!paymentPack.max_bookings_per_day && (
                      <li className="bs-restriction-modal__list__item">
                        <Trans
                          t={t}
                          i18nKey="genericCardDetails.includedElements.restrictions.maxPerDay"
                          count={paymentPack.max_bookings_per_day}
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
                          t={t}
                          i18nKey="genericCardDetails.includedElements.restrictions.maxPerWeek"
                          count={paymentPack.max_bookings_per_week}
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
                          t={t}
                          i18nKey="genericCardDetails.includedElements.restrictions.maxPerMonth"
                          count={paymentPack.max_bookings_per_month}
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

export default compose<any, Props>(
  marketplaceCssHoc(),
  React.memo,
)(MarketplacePaymentPackRestrictionModal);
