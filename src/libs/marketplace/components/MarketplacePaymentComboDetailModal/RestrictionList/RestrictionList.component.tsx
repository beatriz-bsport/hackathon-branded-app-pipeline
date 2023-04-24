// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import PeopleIcon from '@material-ui/icons/People';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import './styles.css';

import type { PaymentCombo } from '#libs/payment-combo/types';

type Props = {
  paymentCombo: PaymentCombo;
};

const RestrictionList: React.FC<Props> = ({ paymentCombo }) => {
  const { t } = useTranslation('marketplace');
  return (
    <ul className="bs-combo-details-dialog__list">
      {!!paymentCombo?.max_purchase_per_member && (
        <li className="bs-combo-details-dialog__list__item">
          <span className="bs-combo-details-dialog__list__item__icon">
            <ShoppingCartIcon />
          </span>
          {t('genericCardDetails.includedElements.maxPurchasePerMember', {
            count: paymentCombo.max_purchase_per_member,
          })}
        </li>
      )}
      {paymentCombo?.new_member_only && (
        <li className="bs-combo-details-dialog__list__item">
          <span className="bs-combo-details-dialog__list__item__icon">
            <PeopleIcon />
          </span>
          {t(`genericCardDetails.includedElements.newMemberOnly`)}
        </li>
      )}
    </ul>
  );
};

export default React.memo(RestrictionList);
