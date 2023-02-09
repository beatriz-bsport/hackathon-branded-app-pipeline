import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose, pure } from 'recompose';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { useValidityInfoForPrivatePassCard } from '../../utils/private-pass';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';

import './styles.css';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { PrivatePass } from '#libs/private-service/types';

export type Props = {
  privatePass: PrivatePass;
  addToCart: () => void;
  onOpenDetailDialog: () => void;
};

const PassCard: React.FC<Props> = ({
  privatePass,
  addToCart,
  onOpenDetailDialog,
}) => {
  const { t } = useTranslation(['marketplace']);

  return (
    <Card classes={{ 'bs-pass-card': 'bs-pass-card' }}>
      <Content padding>
        <Grid classes={{ 'bs-pass-card__grid': 'bs-pass-card__grid' }}>
          <Item alignment={Alignment.FLEX_START} columnEnd={1}>
            <div className="bs-pass-card__title">{privatePass.name}</div>
            <div className="bs-pass-card__subtitle">
              {t('genericCard.credits.availableCredit', {
                count: privatePass.credits,
              })}
            </div>
            <div className="bs-pass-card__description">
              {privatePass.description}
            </div>
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-pass-card__validity">
              <div className="bs-pass-card__validity__content">
                {useValidityInfoForPrivatePassCard(privatePass)}
              </div>
            </div>
            <Price
              amount={privatePass.price}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
            >
              <div className="bs-pass-card__price-icon">
                <ShoppingCartIcon />
              </div>
            </Price>
          </Item>
        </Grid>
        <Item
          justification={Justification.SPACE_BETWEEN}
          direction={Direction.ROW}
          classes={{ 'bs-pass-card__footer': 'bs-pass-card__footer' }}
        >
          <button
            type="button"
            className="bs-pass-card__left-button"
            onClick={onOpenDetailDialog}
          >
            <div className="bs-pass-card__left-button__content">
              <VisibilityIcon className="bs-pass-card__left-button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            type="button"
            className="bs-pass-card__right-button"
            onClick={addToCart}
          >
            {t('genericCard.addButton.buttonContent')}
          </button>
        </Item>
      </Content>
    </Card>
  );
};

export default compose(marketplaceCssHoc(), pure)(PassCard);
