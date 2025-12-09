import React, { useEffect, useId, useRef, useState } from "react";

import {
  Button,
  Modal,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { SearchMemberList } from "./SearchMemberList";
import { useFetchTags } from "./useFetchTags";

type SearchMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (to: string) => void;
  navigateInContext: (to: string, isRevamped?: boolean) => void;
};

export const SearchMemberModal: React.FC<SearchMemberModalProps> = ({
  isOpen,
  onClose,
  navigate,
  navigateInContext,
}) => {
  const { t } = useTranslation("features");

  // State for the TextField
  const [input, setInput] = useState("");
  // Debounced state for the search params in the query
  const [debouncedInput, setDebouncedInput] = useState("");
  const debouncedSetValue = useDebounce(setDebouncedInput);

  // Debounce the update of the input to not trigger to many searchs
  useEffect(() => {
    debouncedSetValue(input.trim());
  }, [input, debouncedSetValue]);

  // ----- Handlers -----

  const handleClose = () => {
    setInput("");
    onClose();
  };

  const onAddMemberClick = () => {
    navigateInContext(`${LEGACY_URLS.member}/add`, false);
    handleClose();
  };

  // Trigger focus on search bar when opening the modal
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef.current?.focus?.();
    }
  }, [isOpen]);

  const { tagsMap } = useFetchTags();

  const textFieldId = useId();

  const isMobile = !useMatchMedia("sm");

  const navigateInLegacy = (to: string) => {
    handleClose();
    if (navigate) {
      navigate?.(to);
    } else {
      window.location.assign(to);
    }
  };

  return (
    <Modal
      size="lg"
      open={isOpen}
      title={t("searchMembers.title")}
      onClose={handleClose}
    >
      <>
        <div className="flex flex-row items-stretch gap-xs">
          <TextField
            id={textFieldId}
            type="search"
            iconLeft="search-refraction"
            autoFocus
            fullWidth
            value={input}
            inputRef={inputRef}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onClear={() => setInput("")}
            containerProps={{
              className: "flex-1",
            }}
          />
          {isMobile ? (
            <Button
              kind="icon-button"
              icon="plus"
              intent="default"
              color="main"
              size="md"
              label={t("searchMembers.addMember")}
              onClick={onAddMemberClick}
            />
          ) : (
            <Button
              iconLeft="plus"
              intent="default"
              color="main"
              size="md"
              label={t("searchMembers.addMember")}
              onClick={onAddMemberClick}
            />
          )}
        </div>
        <SearchMemberList
          searchInput={debouncedInput}
          navigate={navigateInLegacy}
          tagsMap={tagsMap}
          isMobile={isMobile}
        />
      </>
    </Modal>
  );
};
