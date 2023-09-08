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
import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';
import { PrivatePass } from '#libs/private-service/types';
import Button, { ButtonColor } from '#components/css-only/Fabrique/Button';

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
        <div ref={dialogRef} className="bs-pass-details-dialog ">
          <Card
            classes={{
              'bs-pass-details-dialog__card': 'bs-pass-details-dialog__card',
            }}
            size={CardSize.L}
          >
            <div
              ref={modalRef}
              className="bs-pass-details-dialog__card-content"
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
                    <Item rowEnd={1} rowStart={1}>
                      <div className="bs-pass-details-dialog__header">
                        <h3 className="bs-pass-details-dialog__header__title">
                          {privatePass.name}
                        </h3>
                        <Price
                          amount={privatePass.price}
                          classes={{
                            'bs-pass-details-dialog__price':
                              'bs-pass-details-dialog__price',
                          }}
                          color={Color.PRIMARY}
                          formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                          isExcludingTax={isExcludingTax}
                          tax={tax}
                        />
                      </div>
                    </Item>
                    <Item rowStart={2}>
                      <PrivatePassDetailsList
                        compatiblePrivateServices={compatiblePrivateServices}
                        hideCredits={!!hideCredits}
                        onShowCompatibilityDialog={onShowCompatibilityDialog}
                        privatePass={privatePass}
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
                        classes={{
                          'bs-pass-details-dialog__description':
                            'bs-pass-details-dialog__description',
                          'bs-pass-details-dialog__item':
                            'bs-pass-details-dialog__item',
                        }}
                        rowStart={3}
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
                    alignment={Alignment.CENTER}
                    classes={{
                      'bs-pass-details-dialog__item':
                        'bs-pass-details-dialog__item',
                      'bs-pack-details-dialog__item__buttons':
                        'bs-pack-details-dialog__item__buttons',
                    }}
                    direction={Direction.ROW}
                    justification={Justification.FLEX_END}
                    rowStart={4}
                  >
                    <div className="bs-pass-details-dialog__buttons">
                      <Button
                        classes={{
                          root: 'bs-pass-details-dialog__buttons__cancel',
                        }}
                        onClick={onDialogClose}
                      >
                        {t('common:cancel')}
                      </Button>
                      <Button
                        classes={{
                          root: 'bs-pass-details-dialog__buttons__add-to-cart',
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
};

export const MarketplacePrivatePassDetailsModalForStorybook =
  marketplaceCssHoc()(MarketplacePrivatePassDetailsModal);

export default React.memo(MarketplacePrivatePassDetailsModal);
