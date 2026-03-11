import React, { useEffect, useId, useRef, useState } from "react";

import type { Member } from "@bsport/api-cdp";
import { Modal, TextField } from "@bsport/kaizen-primitive-core";
import type { Fetch } from "@bsport/store-base";

import { useCheckoutFlowTrack } from "#src/components/core/checkout-flow-modal/checkout-flow-tracking-context";
import { i18nInstance, useTranslation } from "#src/i18n";

import { MemberSelectorList } from "./member-selector-list";

export type MemberSelectorModalProps = {
  fetch: Fetch<Member[]>;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (member: Member) => void;
  onOpenProfile?: (memberId: number) => void;
};

export const MemberSelectorModal: React.FC<MemberSelectorModalProps> = ({
  fetch,
  isOpen,
  onClose,
  onSelect,
  onOpenProfile,
}) => {
  const { t } = useTranslation("cdp", { i18n: i18nInstance });
  const track = useCheckoutFlowTrack();

  const [searchInput, setSearchInput] = useState("");

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
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
    setSearchInput("");
    onClose();
  };

  const handleEscapeClose = () => {
    track("checkout_flow_member_search_escape_key_button_clicked", {
      member_id: selectedMember?.id,
    });
    handleClose();
  };

  const handleClickOutsideClose = () => {
    track("checkout_flow_member_search_click_outside", {
      member_id: selectedMember?.id,
    });
    handleClose();
  };

  const handleCloseCancel = () => {
    track("checkout_flow_member_search_cancel_button_clicked", {
      member_id: selectedMember?.id,
    });
    handleClose();
  };

  const handleCloseCross = () => {
    track("checkout_flow_member_search_cross_button_clicked", {
      member_id: selectedMember?.id,
    });
    handleClose();
  };

  const handleSelect = (member: Member) => {
    setSelectedMember(member);
  };

  const handleConfirm = () => {
    if (selectedMember) {
      track("checkout_flow_member_search_select_member_button_clicked", {
        member_id: selectedMember.id,
      });
      onSelect(selectedMember);
      handleClose();
    }
  };

  const handleOpenProfile = (memberId: number) => {
    track("checkout_flow_member_search_member_information_button_clicked", {
      member_id: memberId,
    });
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
      onClose={handleEscapeClose}
      onCloseButtonClick={handleCloseCross}
      onClickOutside={handleClickOutsideClose}
      confirmButton={{
        color: "main",
        label: t("memberSelectorModal.selectMember"),
        type: "button",
        onClick: handleConfirm,
        disabled: !selectedMember,
      }}
      cancelButton={{
        label: t("memberSelectorModal.cancel"),
        onClick: handleCloseCancel,
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
            setSearchInput(e.target.value.trim());
          }}
          onClear={() => setSearchInput("")}
          placeholder={t("memberSelectorModal.searchPlaceholder")}
        />
        <MemberSelectorList
          fetch={fetch}
          searchInput={searchInput}
          onSelect={handleSelect}
          onOpenProfile={handleOpenProfile}
          selectedMemberId={selectedMember?.id}
        />
      </div>
    </Modal>
  );
};

MemberSelectorModal.displayName = "KaizenMemberSelectorModal";
