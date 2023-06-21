// @ts-nocheck
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

import PaymentPackDetailList from './DetailList/PaymentPackDetailList.component';

import { useDialogClickAwayListener } from '../../../../hooks/useDialogClickAwayListener';

import { PaymentPack } from '#libs/payment-packs/types';

export type Props = {
  paymentPack: PaymentPack;
  isOpen: boolean;
  isCompatibleWithAll?: boolean;
  isExcludingTax: boolean;
  tax: number | undefined;
  onDialogClose: () => void;
  onAddToCart: (packId: number) => void;
  onShowCompatibilityDialog: () => void;
  onShowRestrictionDialog: () => void;
  hideCredits?: boolean;
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
  }) => {
    const { t } = useTranslation('marketplace');

    const { dialogRef, modalRef } = useDialogClickAwayListener({
      onDialogClose,
    });
    const handleAddToCart = () => onAddToCart(paymentPack.id);

    return (
      <>
        {isOpen && (
          <div className="bs-pack-details-dialog " ref={dialogRef}>
            <Card
              size={CardSize.L}
              classes={{
                'bs-pack-details-dialog__card': 'bs-pack-details-dialog__card',
              }}
            >
              <div
                className="bs-pack-details-dialog__card-content"
                ref={modalRef}
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
                      <Item rowStart={1} rowEnd={1}>
                        <div className="bs-pack-details-dialog__header">
                          <h3 className="bs-pack-details-dialog__header__title">
                            {paymentPack.name}
                          </h3>
                          <Price
                            formatPriceWithCurrency={
                              getCurrencyDisplayWithPrice
                            }
                            amount={paymentPack.price}
                            color={Color.PRIMARY}
                            classes={{
                              'bs-pack-details-dialog__price':
                                'bs-pack-details-dialog__price',
                            }}
                            isExcludingTax={isExcludingTax}
                            tax={tax}
                          />
                        </div>
                      </Item>
                      <Item rowStart={2}>
                        <PaymentPackDetailList
                          paymentPack={paymentPack}
                          isCompatibleWithAll={isCompatibleWithAll}
                          onShowCompatibilityDialog={onShowCompatibilityDialog}
                          onShowRestrictionDialog={onShowRestrictionDialog}
                          hideCredits={!!hideCredits}
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
                          rowStart={3}
                          classes={{
                            'bs-pack-details-dialog__item':
                              'bs-pack-details-dialog__item',
                            'bs-pack-details-dialog__description':
                              'bs-pack-details-dialog__description',
                          }}
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
                      rowStart={4}
                      direction={Direction.ROW}
                      alignment={Alignment.CENTER}
                      justification={Justification.FLEX_END}
                      classes={{
                        'bs-pack-details-dialog__item':
                          'bs-pack-details-dialog__item',
                        'bs-pack-details-dialog__item__buttons':
                          'bs-pack-details-dialog__item__buttons',
                      }}
                    >
                      <div className="bs-pack-details-dialog__buttons">
                        <button
                          className="bs-pack-details-dialog__buttons__cancel"
                          type="button"
                          onClick={onDialogClose}
                        >
                          {t('common:cancel')}
                        </button>
                        <button
                          className="bs-pack-details-dialog__buttons__add-to-cart"
                          type="button"
                          onClick={handleAddToCart}
                        >
                          {t('genericCard.addButton.buttonContent')}
                        </button>
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
