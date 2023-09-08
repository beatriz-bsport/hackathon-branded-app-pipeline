import React from 'react';
import './styles.css';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import Card, { CardSize } from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price, { Color } from '#components/css-only/Price';

import PaymentPackDetailList from '#marketplacecomponents/@PaymentPack/MarketplacePaymentPackDetailModal/DetailList/PaymentPackDetailList.component';

import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';

import { PaymentPack } from '#libs/payment-packs/types';
import Button, { ButtonColor } from '#components/css-only/Fabrique/Button';

export type Props = {
  paymentPack: PaymentPack;
  isOpen: boolean;
  isCompatibleWithAll?: boolean;
  isExcludingTax: boolean;
  tax: number;
  onDialogClose: () => void;
  onAddToCart: (packId: number) => void;
  onShowCompatibilityDialog: () => void;
  onShowRestrictionDialog: () => void;
  hideCredits?: boolean;
  onShowOffPeakRestrictionDialog: () => void;
};

const MarketplacePaymentPackDetailsModal: React.FC<Props> = React.memo(
  ({
    paymentPack,
    isOpen,
    isCompatibleWithAll,
    isExcludingTax,
    tax,
    onShowRestrictionDialog,
    onDialogClose,
    onAddToCart,
    onShowCompatibilityDialog,
    hideCredits,
    onShowOffPeakRestrictionDialog,
  }) => {
    const { t } = useTranslation('marketplace');

    const { dialogRef, modalRef } = useDialogClickAwayListener({
      onDialogClose,
    });
    const handleAddToCart = () => onAddToCart(paymentPack.id);

    return (
      <>
        {isOpen && (
          <div ref={dialogRef} className="bs-pack-details-dialog ">
            <Card
              classes={{
                'bs-pack-details-dialog__card': 'bs-pack-details-dialog__card',
              }}
              size={CardSize.L}
            >
              <div
                ref={modalRef}
                className="bs-pack-details-dialog__card-content"
              >
                <div className="bs-pack-details-dialog__container">
                  <Content
                    padding
                    classes={{
                      'bs-pack-details-dialog__header-container':
                        'bs-pack-details-dialog__header-container',
                    }}
                  >
                    <Grid>
                      <Item rowEnd={1} rowStart={1}>
                        <div className="bs-pack-details-dialog__header">
                          <h3 className="bs-pack-details-dialog__header__title">
                            {paymentPack.name}
                          </h3>
                          <Price
                            amount={paymentPack.price}
                            classes={{
                              'bs-pack-details-dialog__price':
                                'bs-pack-details-dialog__price',
                            }}
                            color={Color.PRIMARY}
                            formatPriceWithCurrency={
                              getCurrencyDisplayWithPrice
                            }
                            isExcludingTax={isExcludingTax}
                            tax={tax}
                          />
                        </div>
                      </Item>
                      <Item rowStart={2}>
                        <PaymentPackDetailList
                          hideCredits={!!hideCredits}
                          isCompatibleWithAll={isCompatibleWithAll}
                          onShowCompatibilityDialog={onShowCompatibilityDialog}
                          onShowOffPeakRestrictionDialog={
                            onShowOffPeakRestrictionDialog
                          }
                          onShowRestrictionDialog={onShowRestrictionDialog}
                          paymentPack={paymentPack}
                        />
                      </Item>
                    </Grid>
                  </Content>
                  {!!paymentPack.description && (
                    <Content
                      classes={{
                        'bs-pack-details-dialog__body':
                          'bs-pack-details-dialog__body',
                      }}
                    >
                      <Grid
                        classes={{
                          'bs-pack-details-dialog__grid':
                            'bs-pack-details-dialog__grid',
                        }}
                      >
                        <Item
                          classes={{
                            'bs-pack-details-dialog__item':
                              'bs-pack-details-dialog__item',
                            'bs-pack-details-dialog__description':
                              'bs-pack-details-dialog__description',
                          }}
                          rowStart={3}
                        >
                          {paymentPack.description}
                        </Item>
                      </Grid>
                    </Content>
                  )}
                </div>
                <Content
                  classes={{
                    'bs-pack-details-dialog__footer':
                      'bs-pack-details-dialog__footer',
                  }}
                >
                  <Grid
                    classes={{
                      'bs-pack-details-dialog__grid --footer':
                        'bs-pack-details-dialog__grid --footer',
                    }}
                  >
                    <Item
                      alignment={Alignment.CENTER}
                      classes={{
                        'bs-pack-details-dialog__item':
                          'bs-pack-details-dialog__item',
                        'bs-pack-details-dialog__item__buttons':
                          'bs-pack-details-dialog__item__buttons',
                      }}
                      direction={Direction.ROW}
                      justification={Justification.FLEX_END}
                      rowStart={4}
                    >
                      <div className="bs-pack-details-dialog__buttons">
                        <Button
                          classes={{
                            root: 'bs-pack-details-dialog__buttons__cancel',
                          }}
                          onClick={onDialogClose}
                        >
                          {t('common:cancel')}
                        </Button>
                        <Button
                          classes={{
                            root: 'bs-pack-details-dialog__buttons__add-to-cart',
                          }}
                          color={ButtonColor.PRIMARY}
                          onClick={handleAddToCart}
                        >
                          {t('genericCard.addButton.buttonContent')}
                        </Button>
                      </div>
                    </Item>
                  </Grid>
                </Content>
              </div>
            </Card>
          </div>
        )}
      </>
    );
  },
);

export const MarketplacePaymentPackDetailsModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackDetailsModal);

export default MarketplacePaymentPackDetailsModal;
