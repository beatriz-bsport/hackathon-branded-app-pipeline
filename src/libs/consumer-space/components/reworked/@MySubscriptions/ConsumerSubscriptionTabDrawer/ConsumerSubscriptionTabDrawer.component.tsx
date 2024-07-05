import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

import type { SubscriptionTab } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import { SubscriptionTabEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';

import './styles.css';

type Props = {
  isOpen: boolean;
  selectedTab: SubscriptionTab;
  handleSetSelectedTab: (type: SubscriptionTab) => void;
  handleClose: () => void;
};

const ConsumerSubscriptionTabDrawer: React.FC<Props> = ({
  isOpen,
  selectedTab,
  handleSetSelectedTab,
  handleClose,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSelectTab = useCallback(
    (type: SubscriptionTab) => {
      handleSetSelectedTab(type);
      handleClose();
    },
    [handleClose, handleSetSelectedTab],
  );

  const subscriptionTabData = useMemo(
    () => ({
      [SubscriptionTabEnum.ACTIVE]: {
        label: t('reworked.mySubscriptions.tab.active'),
        isSelected: selectedTab === SubscriptionTabEnum.ACTIVE,
        onClick: () => handleSelectTab(SubscriptionTabEnum.ACTIVE),
      },
      [SubscriptionTabEnum.FUTURE]: {
        label: t('reworked.mySubscriptions.tab.future'),
        isSelected: selectedTab === SubscriptionTabEnum.FUTURE,
        onClick: () => handleSelectTab(SubscriptionTabEnum.FUTURE),
      },
      [SubscriptionTabEnum.EXPIRED]: {
        label: t('reworked.mySubscriptions.tab.expired'),
        isSelected: selectedTab === SubscriptionTabEnum.EXPIRED,
        onClick: () => handleSelectTab(SubscriptionTabEnum.EXPIRED),
      },
    }),
    [handleSelectTab, selectedTab, t],
  );

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-subscription-tab-drawer__root"
      modalDialogProps={{
        title: t('consumerSpace:reworked.myBookings.chooseBookingType'),
        onClose: handleClose,
        onCancel: handleClose,
      }}
    >
      <List className="bs-consumer-subscription-tab-drawer__list">
        <ListItem
          classes={{ label: 'bs-consumer-subscription-tab-drawer__list__item' }}
          isSelected={
            subscriptionTabData[SubscriptionTabEnum.ACTIVE].isSelected
          }
          label={subscriptionTabData[SubscriptionTabEnum.ACTIVE].label}
          onClick={subscriptionTabData[SubscriptionTabEnum.ACTIVE].onClick}
          type="clickableText"
        />
        <ListItem
          classes={{ label: 'bs-consumer-subscription-tab-drawer__list__item' }}
          isSelected={
            subscriptionTabData[SubscriptionTabEnum.FUTURE].isSelected
          }
          label={subscriptionTabData[SubscriptionTabEnum.FUTURE].label}
          onClick={subscriptionTabData[SubscriptionTabEnum.FUTURE].onClick}
          type="clickableText"
        />
        <ListItem
          classes={{ label: 'bs-consumer-subscription-tab-drawer__list__item' }}
          isSelected={
            subscriptionTabData[SubscriptionTabEnum.EXPIRED].isSelected
          }
          label={subscriptionTabData[SubscriptionTabEnum.EXPIRED].label}
          onClick={subscriptionTabData[SubscriptionTabEnum.EXPIRED].onClick}
          type="clickableText"
        />
      </List>
    </BottomDrawer>
  );
};

export default React.memo(ConsumerSubscriptionTabDrawer);
