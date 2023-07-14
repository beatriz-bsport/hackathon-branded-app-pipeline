import React from 'react';
import { useTranslation } from 'react-i18next';

import './styles.css';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price, { Color } from '#csscomponents/Price';

import PaymentComboItemList from '../MarketplacePaymentComboCard/PaymentComboItemList';
import InitialPrice from '../MarketplacePaymentComboCard/InitialPrice';
import RestrictionList from './RestrictionList';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { useDialogClickAwayListener } from '../../../../hooks/useDialogClickAwayListener';

import type { PaymentCombo } from '#libs/payment-combo/types';

export type Props = {
  paymentCombo: PaymentCombo;
  isOpen: boolean;
  tax: number;
  isExcludingTax: boolean;
  onDialogClose: () => void;
  onAddToCart: () => void;
};

const MarketplacePaymentComboDetailsModal: React.FC<Props> = ({
  paymentCombo,
  isOpen,
  isExcludingTax,
  tax,
  onDialogClose,
  onAddToCart,
}) => {
  const { t } = useTranslation('marketplace');
  const { dialogRef, modalRef } = useDialogClickAwayListener({ onDialogClose });

  return (
    <>
      {isOpen && (
        <div className="bs-combo-details-dialog" ref={dialogRef}>
          <Card
            size={CardSize.L}
            classes={{
              'bs-combo-details-dialog__card': 'bs-combo-details-dialog__card',
            }}
          >
            <div
              className="bs-combo-details-dialog__card-content"
              ref={modalRef}
            >
              <div className="bs-combo-details-dialog__container">
                <Content
                  padding
                  classes={{
                    'bs-combo-details-dialog__header':
                      'bs-combo-details-dialog__header',
                  }}
                >
                  <Grid>
                    <Item
                      rowStart={1}
                      rowEnd={1}
                      classes={{
                        'bs-combo-details-dialog__header-item':
                          'bs-combo-details-dialog__header-item',
                      }}
                    >
                      <div className="bs-combo-details-dialog__header__title-container">
                        <h3 className="bs-combo-details-dialog__header__title">
                          {paymentCombo?.name}
                        </h3>
                        <div className="bs-combo-details-dialog__header__price-container">
                          <Price
                            formatPriceWithCurrency={
                              getCurrencyDisplayWithPrice
                            }
                            amount={paymentCombo?.price}
                            color={Color.PRIMARY}
                            classes={{
                              'bs-combo-details-dialog__price':
                                'bs-combo-details-dialog__price',
                            }}
                            isExcludingTax={isExcludingTax}
                            tax={tax}
                          />
                          <InitialPrice
                            paymentCombo={paymentCombo}
                            isExcludingTax={isExcludingTax}
                          />
                        </div>
                      </div>
                    </Item>
                    <Item
                      rowStart={2}
                      classes={{
                        'bs-combo-details-dialog__list-container':
                          'bs-combo-details-dialog__list-container',
                      }}
                    >
                      <RestrictionList paymentCombo={paymentCombo} />
                    </Item>
                  </Grid>
                </Content>
                <Content
                  classes={{
                    'bs-combo-details-dialog__body':
                      'bs-combo-details-dialog__body',
                  }}
                >
                  <Grid
                    classes={{
                      'bs-combo-details-dialog__grid':
                        'bs-combo-details-dialog__grid',
                    }}
                  >
                    {!!paymentCombo && (
                      <Item
                        rowStart={1}
                        classes={{
                          'bs-combo-details-dialog__content-list':
                            'bs-combo-details-dialog__content-list',
                        }}
                      >
                        <h4>{t('packCardDetail.comboItemList.content')}</h4>
                        <PaymentComboItemList
                          paymentCombo={paymentCombo}
                          displayAllitems
                        />
                      </Item>
                    )}
                    <Item
                      rowStart={2}
                      classes={{
                        'bs-combo-details-dialog__description':
                          'bs-combo-details-dialog__description',
                      }}
                    >
                      {paymentCombo?.description}
                    </Item>
                  </Grid>
                </Content>
              </div>
              <Content
                classes={{
                  'bs-combo-details-dialog__footer':
                    'bs-combo-details-dialog__footer',
                }}
              >
                <Grid
                  classes={{
                    'bs-combo-details-dialog__grid':
                      'bs-combo-details-dialog__grid',
                    '--footer': '--footer',
                  }}
                >
                  <Item
                    rowStart={4}
                    direction={Direction.ROW}
                    alignment={Alignment.CENTER}
                    justification={Justification.FLEX_END}
                    classes={{
                      'bs-combo-details-dialog__footer__item':
                        'bs-combo-details-dialog__footer__item',
                    }}
                  >
                    <div className="bs-combo-details-dialog__buttons">
                      <button
                        className="bs-combo-details-dialog__buttons__cancel"
                        type="button"
                        onClick={onDialogClose}
                      >
                        {t('common:cancel')}
                      </button>
                      <button
                        className="bs-combo-details-dialog__buttons__add-to-cart"
                        type="button"
                        onClick={onAddToCart}
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
};

export const MarketplacePaymentComboDetailsModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentComboDetailsModal);

export default React.memo(MarketplacePaymentComboDetailsModal);
