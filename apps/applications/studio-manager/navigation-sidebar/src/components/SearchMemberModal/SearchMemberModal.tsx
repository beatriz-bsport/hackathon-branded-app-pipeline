import React, { useEffect, useId, useRef, useState } from "react";

import {
  Button,
  List,
  Modal,
  Popover,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import {
  selectSearchedMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useDebounce } from "@bsport/use-debounce";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { SearchMemberList } from "./SearchMemberList";
import { SearchMemberListItem } from "./SearchMemberListItem";
import type { ListItemProps } from "./constants";
import { useFetchTags } from "./useFetchTags";
import { useFormatMembers } from "./useFormatMembers";
import { useListItemTranslations } from "./useListItemTranslations";

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

  const searchedMembers = useMemberStore(selectSearchedMembers);
  const formattedSearchedMembers = useFormatMembers({
    members: searchedMembers,
    reverse: true,
  });
  const listItemTranslations = useListItemTranslations();

  const textFieldId = useId();

  const isMobile = !useMatchMedia("sm");

  const navigateInLegacy = navigate
    ? (to: string) => {
        handleClose();
        navigate?.(to);
      }
    : undefined;

  return (
    <Modal
      size="lg"
      open={isOpen}
      title={t("searchMembers.title")}
      onClose={handleClose}
    >
      <>
        <div className="flex flex-row items-stretch gap-xs">
          <Popover className="flex-1">
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <TextField
                  id={textFieldId}
                  type="search"
                  iconLeft="search-refraction"
                  autoFocus
                  fullWidth
                  value={input}
                  inputRef={inputRef}
                  onChange={(e) => {
                    setIsPopoverOpened(false); // Hide the history to not clutter the search
                    setInput(e.target.value);
                  }}
                  onClear={() => setInput("")}
                  containerProps={{
                    className: "flex-1",
                  }}
                  onClick={() => {
                    if (searchedMembers.length > 0) {
                      setIsPopoverOpened(true);
                    }
                  }}
                />
              )}
            </Popover.Anchor>
            <Popover.Content
              placement="bottom-left"
              className="w-[968px] max-h-[380px] overflow-y-scroll"
            >
              {() => (
                <List<ListItemProps>
                  id="searched-members-history-list"
                  ListItem={SearchMemberListItem}
                  items={formattedSearchedMembers.map((member) => ({
                    ...member,
                    navigate: navigateInLegacy,
                    ...listItemTranslations,
                    tagsMap,
                    isMobile,
                  }))}
                  isCompact
                />
              )}
            </Popover.Content>
          </Popover>
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
