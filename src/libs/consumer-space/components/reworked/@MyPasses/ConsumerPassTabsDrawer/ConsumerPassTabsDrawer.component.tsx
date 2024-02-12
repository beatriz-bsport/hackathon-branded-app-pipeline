import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

import { PassTabEnum } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/constants';

import type { PassTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';

import './styles.css';

type Props = {
  handleSetSelectedTab: (type: PassTab) => void;
  handleClose: () => void;
  isOpen: boolean;
  selectedPassTab: PassTab;
};

const ConsumerPassTabDrawer: React.FC<Props> = ({
  handleSetSelectedTab,
  handleClose,
  isOpen,
  selectedPassTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSelectTab = useCallback(
    (type: PassTab) => {
      handleSetSelectedTab(type);
      handleClose();
    },
    [handleClose, handleSetSelectedTab],
  );

  const passTabData = useMemo(
    () => ({
      [PassTabEnum.CONSUMER_PAYMENT_PACK]: {
        label: t('consumerSpace:reworked.myPasses.tab.activity'),
        isSelected: selectedPassTab === PassTabEnum.CONSUMER_PAYMENT_PACK,
        onClick: () => handleSelectTab(PassTabEnum.CONSUMER_PAYMENT_PACK),
      },
      [PassTabEnum.PRIVATE_CONSUMER_PASS]: {
        label: t('consumerSpace:reworked.myPasses.tab.appointment'),
        isSelected: selectedPassTab === PassTabEnum.PRIVATE_CONSUMER_PASS,
        onClick: () => handleSelectTab(PassTabEnum.PRIVATE_CONSUMER_PASS),
      },
      [PassTabEnum.UNIVERSAL_PASS]: {
        label: t('consumerSpace:reworked.myPasses.tab.universal'),
        isSelected: selectedPassTab === PassTabEnum.UNIVERSAL_PASS,
        onClick: () => handleSelectTab(PassTabEnum.UNIVERSAL_PASS),
      },
    }),
    [handleSelectTab, selectedPassTab, t],
  );

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-pass-tab-drawer__root"
      modalDialogProps={{
        cancelLabel: t('back', { context: 'common' }),
        title: t('consumerSpace:reworked.myPasses.choosePassType'),
        onClose: handleClose,
        onCancel: handleClose,
      }}
    >
      <List className="bs-consumer-pass-tab-drawer__list">
        <ListItem
          classes={{ label: 'bs-consumer-pass-tab-drawer__list__item__label' }}
          isSelected={passTabData[PassTabEnum.CONSUMER_PAYMENT_PACK].isSelected}
          label={passTabData[PassTabEnum.CONSUMER_PAYMENT_PACK].label}
          onClick={passTabData[PassTabEnum.CONSUMER_PAYMENT_PACK].onClick}
          type="clickableText"
        />
        <ListItem
          classes={{ label: 'bs-consumer-pass-tab-drawer__list__item__label' }}
          isSelected={passTabData[PassTabEnum.PRIVATE_CONSUMER_PASS].isSelected}
          label={passTabData[PassTabEnum.PRIVATE_CONSUMER_PASS].label}
          onClick={passTabData[PassTabEnum.PRIVATE_CONSUMER_PASS].onClick}
          type="clickableText"
        />
        <ListItem
          classes={{ label: 'bs-consumer-pass-tab-drawer__list__item__label' }}
          isSelected={passTabData[PassTabEnum.UNIVERSAL_PASS].isSelected}
          label={passTabData[PassTabEnum.UNIVERSAL_PASS].label}
          onClick={passTabData[PassTabEnum.UNIVERSAL_PASS].onClick}
          type="clickableText"
        />
      </List>
    </BottomDrawer>
  );
};

export default React.memo(ConsumerPassTabDrawer);
