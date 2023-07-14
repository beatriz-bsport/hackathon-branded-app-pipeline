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
import PrivatePassDetailsList from './DetailList/PrivatePassDetailList.component';
import { useDialogClickAwayListener } from '../../../../hooks/useDialogClickAwayListener';
import { PrivatePass } from '#libs/private-service/types';

export type Props = {
  privatePass: PrivatePass;
  isOpen: boolean;
  isExcludingTax: boolean;
  tax: number;
  compatiblePrivateServices: number;
  onDialogClose: () => void;
  onAddToCart: (packId: number) => void;
  onShowCompatibilityDialog: () => void;
  hideCredits?: boolean;
};

const MarketplacePrivatePassDetailsModal: React.FC<Props> = ({
  privatePass,
  isOpen,
  isExcludingTax,
  tax,
  compatiblePrivateServices,
  onDialogClose,
  onAddToCart,
  onShowCompatibilityDialog,
  hideCredits,
}) => {
  const { t } = useTranslation('marketplace');

  const { dialogRef, modalRef } = useDialogClickAwayListener({ onDialogClose });
  const handleAddToCart = () => onAddToCart(privatePass.id);

  return (
    <>
      {isOpen && (
        <div className="bs-pass-details-dialog " ref={dialogRef}>
          <Card
            size={CardSize.L}
            classes={{
              'bs-pass-details-dialog__card': 'bs-pass-details-dialog__card',
            }}
          >
            <div
              className="bs-pass-details-dialog__card-content"
              ref={modalRef}
            >
              <div className="bs-pass-details-dialog__container">
                <Content
                  padding
                  classes={{
                    'bs-pass-details-dialog__header-container':
                      'bs-pass-details-dialog__header-container',
                  }}
                >
                  <Grid>
                    <Item rowStart={1} rowEnd={1}>
                      <div className="bs-pass-details-dialog__header">
                        <h3 className="bs-pass-details-dialog__header__title">
                          {privatePass.name}
                        </h3>
                        <Price
                          formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                          amount={privatePass.price}
                          color={Color.PRIMARY}
                          classes={{
                            'bs-pass-details-dialog__price':
                              'bs-pass-details-dialog__price',
                          }}
                          isExcludingTax={isExcludingTax}
                          tax={tax}
                        />
                      </div>
                    </Item>
                    <Item rowStart={2}>
                      <PrivatePassDetailsList
                        privatePass={privatePass}
                        compatiblePrivateServices={compatiblePrivateServices}
                        onShowCompatibilityDialog={onShowCompatibilityDialog}
                        hideCredits={!!hideCredits}
                      />
                    </Item>
                  </Grid>
                </Content>
                {!!privatePass.description && (
                  <Content>
                    <Grid
                      classes={{
                        'bs-pass-details-dialog__grid':
                          'bs-pass-details-dialog__grid',
                      }}
                    >
                      <Item
                        rowStart={3}
                        classes={{
                          'bs-pass-details-dialog__description':
                            'bs-pass-details-dialog__description',
                          'bs-pass-details-dialog__item':
                            'bs-pass-details-dialog__item',
                        }}
                      >
                        {privatePass.description}
                      </Item>
                    </Grid>
                  </Content>
                )}
              </div>
              <Content
                classes={{
                  'bs-pass-details-dialog__footer':
                    'bs-pass-details-dialog__footer',
                }}
              >
                <Grid
                  classes={{
                    'bs-pass-details-dialog__grid':
                      'bs-pass-details-dialog__grid',
                    'bs-pass-details-dialog__footer-grid':
                      'bs-pass-details-dialog__footer-grid',
                  }}
                >
                  <Item
                    rowStart={4}
                    direction={Direction.ROW}
                    alignment={Alignment.CENTER}
                    justification={Justification.FLEX_END}
                    classes={{
                      'bs-pass-details-dialog__item':
                        'bs-pass-details-dialog__item',
                      'bs-pack-details-dialog__item__buttons':
                        'bs-pack-details-dialog__item__buttons',
                    }}
                  >
                    <div className="bs-pass-details-dialog__buttons">
                      <button
                        className="bs-pass-details-dialog__buttons__cancel"
                        type="button"
                        onClick={onDialogClose}
                      >
                        {t('common:cancel')}
                      </button>
                      <button
                        className="bs-pass-details-dialog__buttons__add-to-cart"
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
};

export const MarketplacePrivatePassDetailsModalForStorybook =
  marketplaceCssHoc()(MarketplacePrivatePassDetailsModal);

export default React.memo(MarketplacePrivatePassDetailsModal);
