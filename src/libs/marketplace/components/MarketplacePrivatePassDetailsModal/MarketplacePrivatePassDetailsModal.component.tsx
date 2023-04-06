import React from 'react';
import './styles.css';
import { compose } from 'recompose';
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

import type { PrivatePass } from '#libs/private-service/types';

export type Props = {
  privatePass: PrivatePass;
  isOpen: boolean;
  onDialogClose: () => void;
  onAddToCart: () => void;
  onShowCompatibilityDialog: () => void;
};

const MarketplacePrivatePassDetailsModal: React.FC<Props> = ({
  privatePass,
  isOpen,
  onDialogClose,
  onAddToCart,
  onShowCompatibilityDialog,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <div className="bs-pass-details-dialog ">
      {isOpen && (
        <Card
          size={CardSize.L}
          classes={{
            'bs-pass-details-dialog__card': 'bs-pass-details-dialog__card',
          }}
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
                    />
                  </div>
                </Item>
                <Item rowStart={2}>
                  <PrivatePassDetailsList
                    privatePass={privatePass}
                    onShowCompatibilityDialog={onShowCompatibilityDialog}
                  />
                </Item>
              </Grid>
            </Content>
            <Content
              classes={{
                'bs-pass-details-dialog__body': 'bs-pass-details-dialog__body',
              }}
            >
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
          </div>
          <Content
            classes={{
              'bs-pass-details-dialog__footer':
                'bs-pass-details-dialog__footer',
            }}
          >
            <Grid
              classes={{
                'bs-pass-details-dialog__grid': 'bs-pass-details-dialog__grid',
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
                    onClick={onAddToCart}
                  >
                    {t('paymentCombo.addToCart')}
                  </button>
                </div>
              </Item>
            </Grid>
          </Content>
        </Card>
      )}
    </div>
  );
};

export default compose(
  marketplaceCssHoc(),
  React.memo,
)(MarketplacePrivatePassDetailsModal);
