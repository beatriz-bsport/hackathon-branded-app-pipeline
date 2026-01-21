import React, { useEffect, useId, useRef, useState } from "react";

import { Modal, TextField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import type { Member } from "#src/types/member";

import { MemberSelectorList } from "./MemberSelectorList";

export type MemberSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (member: Member) => void;
  onOpenProfile?: (memberId: number) => void;
};

const MemberSelectorModal: React.FC<MemberSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onOpenProfile,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [debouncedInput, setDebouncedInput] = useState("");
  const debouncedSetValue = useDebounce(setDebouncedInput);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDebouncedInput("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSelectedMember(null);
    }
  }, [isOpen]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef.current?.focus?.();
    }
  }, [isOpen]);

  const textFieldId = useId();

  const handleClose = () => {
    setSelectedMember(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setDebouncedInput("");
    onClose();
  };

  const handleSelect = (member: Member) => {
    setSelectedMember(member);
  };

  const handleConfirm = () => {
    if (selectedMember) {
      onSelect(selectedMember);
      handleClose();
    }
  };

  const handleOpenProfile = (memberId: number) => {
    if (onOpenProfile) {
      onOpenProfile(memberId);
    } else {
      // Default: open in new tab
      const memberUrl = `/member/${memberId}/info`;
      window.open(memberUrl, "_blank");
    }
  };

  return (
    <Modal
      size="lg"
      open={isOpen}
      title={t("memberSelectorModal.title")}
      onClose={handleClose}
      onCloseButtonClick={handleClose}
      onClickOutside={handleClose}
      confirmButton={{
        color: "main",
        label: t("memberSelectorModal.selectMember"),
        type: "button",
        onClick: handleConfirm,
        disabled: !selectedMember,
      }}
      cancelButton={{
        label: t("memberSelectorModal.cancel"),
        onClick: handleClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <TextField
          id={textFieldId}
          type="search"
          iconLeft="search-refraction"
          autoFocus
          fullWidth
          inputRef={inputRef}
          onChange={(e) => {
            debouncedSetValue(e.target.value.trim());
          }}
          onClear={() => setDebouncedInput("")}
          placeholder={t("memberSelectorModal.searchPlaceholder")}
        />
        <MemberSelectorList
          searchInput={debouncedInput}
          onSelect={handleSelect}
          onOpenProfile={handleOpenProfile}
          selectedMemberId={selectedMember?.id}
        />
      </div>
    </Modal>
  );
};

MemberSelectorModal.displayName = "KaizenMemberSelectorModal";

export default MemberSelectorModal;
