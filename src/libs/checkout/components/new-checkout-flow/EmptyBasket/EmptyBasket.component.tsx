import React from 'react';

import { useTranslation } from 'react-i18next';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import StatusMessageWithIcon from '#components/css-only/StatusMessageWithIcon';

import './styles.css';

export type Props = {
  goToMarketplace: () => void;
};

const EmptyBasket: React.FC<Props> = ({ goToMarketplace }) => {
  const { t } = useTranslation('checkout');
  return (
    <StatusMessageWithIcon
      actions={{
        cancel: {
          label: t('myBasket.goToMarketplace'),
          onClick: goToMarketplace,
        },
      }}
      icon={
        <CustomMuiIcon
          customClassName="bs-basket-empty__icon"
          icon="ShoppingBasket"
          MuiIconProps={{ height: 72, width: 72 }}
          variant="primary"
        />
      }
      isLoading={false}
      message={t('myBasket.newCheckout.isEmptyDescription')}
      title={t('myBasket.newCheckout.isEmpty')}
    />
  );
};

export default React.memo(EmptyBasket);
