import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ShopModalContext = React.createContext<ShopModalContextValue>({
  isInventoryFormDirty: false,
  setIsInventoryFormDirty: () => {},
  isVariantFormDirty: false,
  setIsVariantFormDirty: () => {},
  handleLeaveWithoutSaving: () => {},
  setHandleLeaveWithoutSaving: () => {},
  handleSaveAndLeave: () => {},
  setHandleSaveAndLeave: () => {},
});

export type ShopModalContextValue = {
  isInventoryFormDirty: boolean;
  setIsInventoryFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
  isVariantFormDirty: boolean;
  setIsVariantFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
  handleLeaveWithoutSaving: () => void;
  setHandleLeaveWithoutSaving: React.Dispatch<React.SetStateAction<() => void>>;
  handleSaveAndLeave: () => void;
  setHandleSaveAndLeave: React.Dispatch<React.SetStateAction<() => void>>;
};

export const ShopModalContextProvider = (props: {
  children: React.ReactElement;
}) => {
  /**
   * Here a dirty form is whenever current form values arent equal to initial values in formik
   */
  const [isInventoryFormDirty, setIsInventoryFormDirty] = useState(false);
  const [isVariantFormDirty, setIsVariantFormDirty] = useState(false);
  const [handleLeaveWithoutSaving, setHandleLeaveWithoutSaving] =
    useState(null);
  const [handleSaveAndLeave, setHandleSaveAndLeave] = useState(null);

  return (
    <ShopModalContext.Provider
      value={{
        isInventoryFormDirty,
        isVariantFormDirty,
        setIsInventoryFormDirty,
        setIsVariantFormDirty,
        handleLeaveWithoutSaving,
        setHandleLeaveWithoutSaving,
        handleSaveAndLeave,
        setHandleSaveAndLeave,
      }}
    >
      {props.children}
    </ShopModalContext.Provider>
  );
};

export const useShopDetailTabsModalPrompt = () => {
  const { t } = useTranslation(['common', 'shop']);

  const {
    isInventoryFormDirty,
    setIsInventoryFormDirty,
    isVariantFormDirty,
    setIsVariantFormDirty,
    handleLeaveWithoutSaving,
    setHandleLeaveWithoutSaving,
    handleSaveAndLeave,
    setHandleSaveAndLeave,
  } = useContext(ShopModalContext);

  const modalTitle = t(
    'shop:shopItemDetail.table.inventory.unsavedChangesModal.title',
  );

  const modalDescription = t(
    isInventoryFormDirty
      ? 'shop:shopItemDetail.table.inventory.unsavedChangesModal.inventory'
      : 'shop:shopItemDetail.table.inventory.unsavedChangesModal.default',
  );

  const leaveWithoutSavingText = t(
    isInventoryFormDirty ? 'common:discardChanges' : 'common:discard',
  );

  const leaveWithSavingText = t(
    isInventoryFormDirty
      ? 'shop:shopItemDetail.table.inventory.action.update'
      : 'common:save',
  );

  return {
    isInventoryFormDirty,
    setIsInventoryFormDirty,
    isVariantFormDirty,
    setIsVariantFormDirty,
    modalTitle,
    modalDescription,
    handleLeaveWithoutSaving,
    setHandleLeaveWithoutSaving,
    handleSaveAndLeave,
    setHandleSaveAndLeave,
    leaveWithoutSavingText,
    leaveWithSavingText,
  };
};
