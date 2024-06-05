import React from 'react';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Card, { CardSize } from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price, { Color } from '#src/components/css-only/Price';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Button, { ButtonColor } from '#src/components/css-only/Fabrique/Button';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import PaymentComboItemList from '../MarketplacePaymentComboCard/PaymentComboItemList';
import InitialPrice from '../MarketplacePaymentComboCard/InitialPrice';
import RestrictionList from './RestrictionList';

import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';

import './styles.css';

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
                <CardContent
                  padding
                  classes={{
                    'bs-combo-details-dialog__header':
                      'bs-combo-details-dialog__header',
                  }}
                >
                  <Grid>
                    <GridItem
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
                    </GridItem>
                    <GridItem
                      classes={{
                        'bs-combo-details-dialog__list-container':
                          'bs-combo-details-dialog__list-container',
                      }}
                      rowStart={2}
                    >
                      <RestrictionList paymentCombo={paymentCombo} />
                    </GridItem>
                  </Grid>
                </CardContent>
                <CardContent
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
                      <GridItem
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
                      </GridItem>
                    )}
                    <GridItem
                      classes={{
                        'bs-combo-details-dialog__description':
                          'bs-combo-details-dialog__description',
                      }}
                      rowStart={2}
                    >
                      {paymentCombo?.description}
                    </GridItem>
                  </Grid>
                </CardContent>
              </div>
              <CardContent
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
                  <GridItem
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
                  </GridItem>
                </Grid>
              </CardContent>
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
