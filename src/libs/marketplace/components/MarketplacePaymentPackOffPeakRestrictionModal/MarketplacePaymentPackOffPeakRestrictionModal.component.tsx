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
import MarketplacePaymentPackOffPeakSchedule from './MarketplacePaymentPackOffPeakSchedule.component';

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
  const { t } = useTranslation(['marketplace']);

  return (
    <>
      {isOpen && (
        <div className="bs-off_peak-modal__backdrop">
          <Card
            classes={{ 'bs-off_peak-modal': 'bs-off_peak-modal' }}
            size={CardSize.L}
          >
            <Content>
              <Grid>
                <Item alignment={Alignment.CENTER} rowStart={1}>
                  <div className="bs-off_peak-clock-icon-background">
                    <AccessTimeIcon className="bss-off_peak_clock-icon" />
                  </div>
                  <h3 className="bs-off_peak-modal__title">
                    {t('genericCardDetails.compatibleTimeSlot')}
                  </h3>
                </Item>
                <Item
                  classes={{
                    'bs-off_peak-modal__body': 'bs-off_peak-modal__body',
                  }}
                  rowStart={2}
                >
                  <MarketplacePaymentPackOffPeakSchedule
                    paymentPack={paymentPack}
                  />
                </Item>
                <Item alignment={Alignment.CENTER} rowStart={3}>
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

export const MarketplacePaymentPackOffPeakRestrictionModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackOffPeakRestrictionModal);

export default React.memo(MarketplacePaymentPackOffPeakRestrictionModal);
