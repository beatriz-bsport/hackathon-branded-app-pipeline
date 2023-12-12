import React from 'react';

import { useTranslation } from 'react-i18next';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import StatusMessageWithIcon from '#components/css-only/StatusMessageWithIcon';
import { WidgetUtils } from '#libs/widget/WidgetUtils';

import './styles.css';

export type Props = {
  goToMarketplace: () => void;
  goToCalendar: () => void;
};

const EmptyBasket: React.FC<Props> = ({ goToMarketplace, goToCalendar }) => {
  const { t } = useTranslation('checkout');

  const isWidget = WidgetUtils.isWidget();

  const emptyBasketCancelAction = isWidget
    ? {
        label: t('validation.actions.goToCalendar'),
        onClick: goToCalendar,
      }
    : {
        label: t('myBasket.goToMarketplace'),
        onClick: goToMarketplace,
      };

  return (
    <StatusMessageWithIcon
      actions={{
        cancel: emptyBasketCancelAction,
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
      message={!isWidget && t('myBasket.newCheckout.isEmptyDescription')}
      title={t('myBasket.newCheckout.isEmpty')}
    />
  );
};

export default React.memo(EmptyBasket);
