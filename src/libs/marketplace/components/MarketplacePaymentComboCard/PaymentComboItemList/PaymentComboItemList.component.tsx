import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './styles.css';

import type { PaymentCombo } from '#libs/payment-combo/types';

type Props = {
  paymentCombo: PaymentCombo;
  displayAllitems?: boolean;
  numberOfItemsToDisplay?: number;
  classes?: { [key: string]: string };
};

const PaymentComboItemList: React.FC<Props> = ({
  paymentCombo,
  displayAllitems,
  numberOfItemsToDisplay,
  classes,
}) => {
  const { t } = useTranslation('marketplace');

  const privatePassTotalQuantity =
    paymentCombo?.private_passes.reduce(
      (accumulator, currentValue) => currentValue.quantity + accumulator,
      0,
    ) ?? 0;

  const paymentPackTotalQuantity =
    paymentCombo?.payment_packs.reduce(
      (accumulator, currentValue) => currentValue.quantity + accumulator,
      0,
    ) ?? 0;

  const formatedComboItemsToShowInList = [
    !!paymentPackTotalQuantity &&
      t('packCard.comboItemList.paymentPackItem', {
        count: paymentPackTotalQuantity,
      }),
    !!privatePassTotalQuantity &&
      t('packCard.comboItemList.privatePassItem', {
        count: privatePassTotalQuantity,
      }),
    ...paymentCombo.shop_items.map(
      (shopItem) => `${shopItem.quantity} ${shopItem.name}`,
    ),
  ].filter((element) => !!element);

  const formatedComboItemsToShowInReducedList =
    formatedComboItemsToShowInList.slice(0, numberOfItemsToDisplay);

  const countHiddenItems =
    formatedComboItemsToShowInList.length - numberOfItemsToDisplay;

  if (displayAllitems) {
    return (
      <ul className={classNames('bs-combo-item-list', { ...classes })}>
        {formatedComboItemsToShowInList.map((comboItem, index) => (
          <li key={index}>{comboItem}</li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={classNames('bs-combo-item-list', { ...classes })}>
      {formatedComboItemsToShowInReducedList.map((comboItem, index) => (
        <li className="bs-combo-item-list__item" key={index}>
          {comboItem}
        </li>
      ))}
      {countHiddenItems > 0 && (
        <li className="bs-combo-item-list__item --hidden">
          {t('packCard.comboItemList.hiddenItem', { count: countHiddenItems })}
        </li>
      )}
    </ul>
  );
};

PaymentComboItemList.defaultProps = {
  numberOfItemsToDisplay: 3,
};

export default React.memo(PaymentComboItemList);
