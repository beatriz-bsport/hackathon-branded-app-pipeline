import React, { useEffect, useId, useRef, useState } from "react";

import { Button, Modal, TextField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { SearchMemberList } from "./SearchMemberList";

type SearchMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (to: string) => void;
};

export const SearchMemberModal: React.FC<SearchMemberModalProps> = ({
  isOpen,
  onClose,
  navigate,
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

  // Handler to navigate to legacy create page
  const onAddMemberClick = () => {
    const addMemberLocation = `${LEGACY_URLS.member}/add`;
    if (navigate) {
      navigate(addMemberLocation);
    } else {
      window.location.assign(addMemberLocation);
    }
  };

  // Trigger focus on search bar when opening the modal
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef.current?.focus?.();
    }
  }, [isOpen]);

  return (
    <Modal
      size="lg"
      open={isOpen}
      title={t("searchMembers.title")}
      onClose={onClose}
    >
      <>
        <div className="flex flex-row items-stretch gap-xs">
          <TextField
            id={useId()}
            type="search"
            iconLeft="search-refraction"
            autoFocus
            fullWidth
            value={input}
            inputRef={inputRef}
            onChange={(e) => setInput(e.target.value)}
            onClear={() => setInput("")}
            containerProps={{
              className: "flex-1",
            }}
          />
          {input.length === 0 && (
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
        <SearchMemberList searchInput={debouncedInput} navigate={navigate} />
      </>
    </Modal>
  );
};
