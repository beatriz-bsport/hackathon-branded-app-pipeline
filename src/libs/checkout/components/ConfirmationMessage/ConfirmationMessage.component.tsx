import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckoutItem, ConfirmationStatus } from '#libs/checkout/types';
import StatusMessageWithIcon from '#components/css-only/StatusMessageWithIcon';
import { OfferWithSpotInformation } from '#libs/offer/types';
import { Subscription } from '#libs/subscription/types';
import Alert, { AlertSeverity } from '#components/css-only/Alert';
import Button, { ButtonSize } from '#components/css-only/Fabrique/Button';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { useConfirmationMessageData } from '#libs/checkout/hooks';

import './styles.css';

export type Props = {
  status: ConfirmationStatus;
  isLoading: boolean;
  offers: OfferWithSpotInformation[];
  checkoutItems: CheckoutItem[];
  billingPlan: Subscription;
  goToCalendar?: () => void;
  goToMemberProfile?: () => void;
  goToMemberPasses?: () => void;
  goToMemberSubscriptions?: () => void;
  goToMemberBookings?: () => void;
  goBack?: () => void;
};

type AlertActionProps = {
  action: () => void;
};

const AlertAction: React.FC<AlertActionProps> = ({ action }) => {
  const { t } = useTranslation('checkout');
  return (
    <Button onClick={action} size={ButtonSize.SMALL}>
      <span className="bs-alert-action-text">
        {t('validation.actions.retryBookingSession')}
      </span>
    </Button>
  );
};

const ConfirmationMessage: React.FC<Props> = ({
  status,
  isLoading,
  goBack,
  goToCalendar,
  goToMemberProfile,
  goToMemberBookings,
  goToMemberPasses,
  goToMemberSubscriptions,
  offers,
  checkoutItems,
  billingPlan,
}) => {
  const messageData = useConfirmationMessageData(
    offers,
    checkoutItems,
    goToCalendar,
    goBack,
    goToMemberProfile,
    goToMemberBookings,
    goToMemberPasses,
    goToMemberSubscriptions,
  );

  if (!messageData || !status) return null;

  return (
    <div className="bs-confirmation-checkout-message__container">
      {!!messageData[status].withAlert && (
        <Alert
          actionElement={
            <AlertAction
              action={messageData[status].withAlert.action.onClick}
            />
          }
          severity={AlertSeverity.ERROR}
        >
          {messageData[status].withAlert.message}
        </Alert>
      )}
      <StatusMessageWithIcon
        actions={
          billingPlan
            ? messageData[status].withSubScriptionActions
            : messageData[status].actions
        }
        icon={messageData[status].icon}
        isLoading={isLoading}
        message={messageData[status].message}
        title={messageData[status].title}
      />
    </div>
  );
};

export const ConfirmationMessageForStorybook =
  marketplaceCssHoc()(ConfirmationMessage);

export default React.memo(ConfirmationMessage);
