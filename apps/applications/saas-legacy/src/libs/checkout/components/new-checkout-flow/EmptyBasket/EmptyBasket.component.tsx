import React from 'react';

import { useTranslation } from 'react-i18next';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';
import StatusMessageWithIcon from '#src/components/css-only/StatusMessageWithIcon';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON } from '#src/libs/exportable-components/constants';

import './styles.css';

export type Props = {
  goToMarketplace: () => void;
  goToCalendar: () => void;
  goToMyProfile: () => void;
};

const EmptyBasket: React.FC<Props> = ({
  goToMarketplace,
  goToCalendar,
  goToMyProfile,
}) => {
  const { t } = useTranslation('checkout');

  const isWidget = WidgetUtils.isWidget();

  const isLoginWidget =
    WidgetUtils.getWidgetType() === EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON;

  const getEmptyBasketCancelAction = React.useCallback(() => {
    if (isLoginWidget) {
      return {
        label: t('validation.actions.backToMyProfile'),
        onClick: goToMyProfile,
      };
    }
    if (isWidget) {
      return {
        label: t('validation.actions.goToCalendar'),
        onClick: goToCalendar,
      };
    }
    return {
      label: t('myBasket.goToMarketplace'),
      onClick: goToMarketplace,
    };
  }, [
    goToCalendar,
    goToMarketplace,
    goToMyProfile,
    isLoginWidget,
    isWidget,
    t,
  ]);

  return (
    <StatusMessageWithIcon
      actions={{
        cancel: getEmptyBasketCancelAction(),
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
