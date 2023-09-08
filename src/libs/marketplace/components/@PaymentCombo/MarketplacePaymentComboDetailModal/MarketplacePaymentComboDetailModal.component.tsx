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

import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';

import type { PaymentCombo } from '#libs/payment-combo/types';
import Button, { ButtonColor } from '#components/css-only/Fabrique/Button';

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
        <div ref={dialogRef} className="bs-combo-details-dialog">
          <Card
            classes={{
              'bs-combo-details-dialog__card': 'bs-combo-details-dialog__card',
            }}
            size={CardSize.L}
          >
            <div
              ref={modalRef}
              className="bs-combo-details-dialog__card-content"
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
                      classes={{
                        'bs-combo-details-dialog__header-item':
                          'bs-combo-details-dialog__header-item',
                      }}
                      rowEnd={1}
                      rowStart={1}
                    >
                      <div className="bs-combo-details-dialog__header__title-container">
                        <h3 className="bs-combo-details-dialog__header__title">
                          {paymentCombo?.name}
                        </h3>
                        <div className="bs-combo-details-dialog__header__price-container">
                          <Price
                            amount={paymentCombo?.price}
                            classes={{
                              'bs-combo-details-dialog__price':
                                'bs-combo-details-dialog__price',
                            }}
                            color={Color.PRIMARY}
                            formatPriceWithCurrency={
                              getCurrencyDisplayWithPrice
                            }
                            isExcludingTax={isExcludingTax}
                            tax={tax}
                          />
                          <InitialPrice
                            isExcludingTax={isExcludingTax}
                            paymentCombo={paymentCombo}
                          />
                        </div>
                      </div>
                    </Item>
                    <Item
                      classes={{
                        'bs-combo-details-dialog__list-container':
                          'bs-combo-details-dialog__list-container',
                      }}
                      rowStart={2}
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
                        classes={{
                          'bs-combo-details-dialog__content-list':
                            'bs-combo-details-dialog__content-list',
                        }}
                        rowStart={1}
                      >
                        <h4>{t('packCardDetail.comboItemList.content')}</h4>
                        <PaymentComboItemList
                          displayAllitems
                          paymentCombo={paymentCombo}
                        />
                      </Item>
                    )}
                    <Item
                      classes={{
                        'bs-combo-details-dialog__description':
                          'bs-combo-details-dialog__description',
                      }}
                      rowStart={2}
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
                    alignment={Alignment.CENTER}
                    classes={{
                      'bs-combo-details-dialog__footer__item':
                        'bs-combo-details-dialog__footer__item',
                    }}
                    direction={Direction.ROW}
                    justification={Justification.FLEX_END}
                    rowStart={4}
                  >
                    <div className="bs-combo-details-dialog__buttons">
                      <Button
                        classes={{
                          root: 'bs-combo-details-dialog__buttons__cancel',
                        }}
                        onClick={onDialogClose}
                      >
                        {t('common:cancel')}
                      </Button>
                      <Button
                        classes={{
                          root: 'bs-combo-details-dialog__buttons__add-to-cart',
                        }}
                        color={ButtonColor.PRIMARY}
                        onClick={onAddToCart}
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
};

export const MarketplacePaymentComboDetailsModalForStorybook =
  marketplaceCssHoc()(MarketplacePaymentComboDetailsModal);

export default React.memo(MarketplacePaymentComboDetailsModal);
