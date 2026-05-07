import type { FC } from "react";

import type { Contract } from "@bsport/api-buyables/contract";
import { Button, DetailsLayout } from "@bsport/kaizen-primitive-core";

import type { ContractFormMethods } from "#src/features/contract-form/types";
import { useContractDetailsHeader } from "#src/hooks/layout/use-contract-details-header";
import { useDisclosure } from "#src/hooks/utils/use-disclosure";
import { useTranslation } from "#src/utils/i18n";

import { ContractEditNameModal } from "./edit-name-modal";

type ContractEditorHeaderProps = {
  methods: ContractFormMethods;
  contract: Contract;
};

/**
 * The ContractEditorHeader is made of
 * - the contract-details-header
 * - and the edit name modal + button
 */
export const ContractEditorHeader: FC<ContractEditorHeaderProps> = ({
  contract,
  methods,
}) => {
  const { t } = useTranslation("contract-details");

  const {
    startGroupActionsRaw,
    endGroupActions: _,
    archiveModal,
    ...headerConfig
  } = useContractDetailsHeader({
    contract,
    isVisible: !methods.watch("manager_only"),
  });

  // When contract is inherited from template, name is readonly and object can't be deleted
  const readonly = contract.contract_template != null;
  const currentName = methods.watch("name");

  const {
    isOpen: isEditNameModalOpen,
    onClose: closeEditNameModal,
    onOpen: openEditNameModal,
  } = useDisclosure();

  const { endGroupActions, startGroupActions, isMobile } =
    DetailsLayout.useAdaptiveActions({
      startGroupActions: startGroupActionsRaw,
      mobileOnlyActions: readonly
        ? []
        : [
            <Button
              key="contract-editor-button-edit-name"
              color="default"
              intent="flat"
              size="md"
              icon="edit-02"
              kind="icon-button"
              label={t("header.actions.renameContract")}
              onClick={openEditNameModal}
            />,
          ],
    });

  const updateName = async (newName: string) => {
    methods.setValue("name", newName, {
      shouldDirty: true,
    });
    closeEditNameModal();
  };

  /**
   * Title Edit button should be visible (e.g. onEditTitleClick defined) when
   * -> it's desktop view (in mobile, the button is in the dropdown menu)
   * -> it's editable
   */
  const onEditTitleClick = isMobile || readonly ? undefined : openEditNameModal;

  return (
    <>
      <DetailsLayout.Header
        pageTitle={currentName}
        {...headerConfig}
        onEditTitleClick={onEditTitleClick}
        endGroupActions={endGroupActions}
        startGroupActions={startGroupActions}
      />

      <ContractEditNameModal
        key={currentName} // Force rerender one value has been updated
        isOpen={isEditNameModalOpen}
        onClose={closeEditNameModal}
        initialName={currentName}
        onConfirm={updateName}
      />

      {archiveModal}
    </>
  );
};
