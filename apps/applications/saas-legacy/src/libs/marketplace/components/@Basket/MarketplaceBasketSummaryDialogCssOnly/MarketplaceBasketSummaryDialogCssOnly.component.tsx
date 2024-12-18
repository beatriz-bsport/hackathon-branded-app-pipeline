import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Button, {
  ButtonColor,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/Button';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import BasketSummaryCssOnly from '#src/libs/marketplace/components/@Basket/BasketSummaryCssOnly';
import LinearProgress from '#src/components/css-only/Fabrique/LinearProgress';
import type {
  Basket,
  PrepaidLine,
  HandleAddCheckoutItemData,
} from '#src/libs/checkout/types';
import type { OptionCallback } from '../../../../../state/types';

import './styles.css';

export type Props = {
  basket: Basket<string, PrepaidLine>;
  goToCheckout: () => void;
  isExcludingTax?: boolean;
  loading: boolean;
  onAddCheckoutItem: (
    data: HandleAddCheckoutItemData,
    options?: OptionCallback,
  ) => void;
  onCancel: () => void;
  onRemoveCheckoutItem: (data: {
    checkout_item: string;
    quantity: number;
  }) => void;
  open: boolean;
  isCustomCssPreview?: boolean;
};

export const MarketplaceBasketSummaryDialogCssOnly: React.FC<Props> = ({
  basket,
  goToCheckout,
  isCustomCssPreview,
  isExcludingTax,
  loading,
  onAddCheckoutItem,
  onCancel,
  onRemoveCheckoutItem,
  open,
}) => {
  const { t } = useTranslation('checkout');

  return (
    <GenericResponsiveDialog
      disableEnforceFocus={isCustomCssPreview}
      disablePortal={isCustomCssPreview}
      id="bs-basket_summary--dialog"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <div className="bs-setup-variable" id="bs-setup-derived-variable">
        {loading && <LinearProgress />}
        <div className="bs-basket_summary_dialog_content--container">
          <div className="bs-basket_summary_dialog_title--container">
            <h3 className="bs-basket_summary_dialog_title--text">
              {t('myBasket.title')}
            </h3>
          </div>
          <BasketSummaryCssOnly
            basket={basket}
            isExcludingTax={isExcludingTax}
            loading={loading}
            onAddCheckoutItem={onAddCheckoutItem}
            onRemoveCheckoutItem={onRemoveCheckoutItem}
          />
          <div className="bs-basket_summary_dialog_actions--container">
            <Button
              color={ButtonColor.SECONDARY}
              onClick={onCancel}
              variant={ButtonVariant.TEXT}
            >
              {t('myBasket.actions.closeBasket')}
            </Button>
            <Button
              color={ButtonColor.PRIMARY}
              isDisabled={basket && basket.checkout_items.length === 0}
              onClick={goToCheckout}
              variant={ButtonVariant.TEXT}
            >
              {t('myBasket.actions.checkoutBasket')}
            </Button>
          </div>
        </div>
      </div>
    </GenericResponsiveDialog>
  );
};

export default memo(MarketplaceBasketSummaryDialogCssOnly);
