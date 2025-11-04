import React, { memo } from 'react';
import { usePassCardDataContext } from '../../context/PassCardDataContext';
import Typography from '#Fabrique/Typography';
import ExpandableContent from '#src/components/css-only/Fabrique/expandable-content/ExpandableContent';
import Chip from '#Fabrique/Chip';
import Price from '#src/libs/marketplace/components/price/Price';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Card from '#src/components/css-only/Fabrique/Card';
import { useTranslation } from 'react-i18next';
import { Key01, ShoppingCart01 } from '#src/components/untitledui';

import './style.css';

export const PaymentComboCard: React.FC = memo(() => {
  const { t } = useTranslation('marketplace');

  const { passCardData } = usePassCardDataContext();

  const {
    description,
    name,
    payment_packs,
    price,
    private_passes,
    shop_items,
    tax,
    new_member_only,
  } = passCardData?.paymentComboData ?? {};

  const isEmptyPaymentCombo =
    !private_passes?.length && !payment_packs?.length && !shop_items?.length;

  return (
    <Card className="bs-express-checkout__payment-combo-card__root">
      <div className="bs-express-checkout__payment-combo-card__header">
        <Typography
          className="bs-express-checkout__payment-combo-card__header__title"
          variant="title-sm"
        >
          {name ?? ''}
        </Typography>
        <Price price={price ?? 0} tax={tax} />
      </div>
      <div className="bs-express-checkout__payment-combo-card__chips">
        {new_member_only && (
          <Chip
            className="bs-express-checkout__payment-combo-card__chips__new-member"
            color="info"
            variant="weak"
          >
            {t('passes.detail.header.newMemberOnly')}
          </Chip>
        )}
      </div>
      {!!description?.length && (
        <ExpandableContent
          initiallyOpen
          className="bs-express-checkout__payment-combo-card__description-section"
          id="description"
          title={t('passes.detail.description.label')}
        >
          <Typography
            className="bs-express-checkout__payment-combo-card__description"
            variant="body-md"
          >
            {description}
          </Typography>
        </ExpandableContent>
      )}
      {!isEmptyPaymentCombo && (
        <ExpandableContent
          initiallyOpen
          className="bs-express-checkout__payment-combo-card__compatibility"
          id="compatibility"
          title={t('paymentCombo.content')}
        >
          <div className="bs-express-checkout__payment-combo-card__compatibility__content">
            <List className="bs-express-checkout__payment-combo-card__compatibility__list">
              {!!payment_packs?.length && (
                <ListItem
                  key={'passes'}
                  className="bs-express-checkout__payment-combo-detail__compatibility__list-item"
                  icon={<Key01 stroke="currentColor" />}
                  label={t('packCard.comboItemList.paymentPackItem', {
                    count: payment_packs.length,
                  })}
                  size="sm"
                />
              )}
              {!!private_passes?.length && (
                <ListItem
                  key={'private-passes'}
                  className="bs-express-checkout__payment-combo-detail__compatibility__list-item"
                  icon={<Key01 stroke="currentColor" />}
                  label={t('packCard.comboItemList.privatePassItem', {
                    count: private_passes.length,
                  })}
                  size="sm"
                />
              )}
              {shop_items?.map((shopItem) => (
                <ListItem
                  key={`shop-${shopItem.id}`}
                  className="bs-express-checkout__payment-combo-detail__compatibility__list-item"
                  icon={<ShoppingCart01 stroke="currentColor" />}
                  label={t('paymentCombo.itemQuantityFormat', {
                    quantity: shopItem.quantity,
                    name: shopItem.name,
                  })}
                  size="sm"
                />
              ))}
            </List>
          </div>
        </ExpandableContent>
      )}
    </Card>
  );
});
