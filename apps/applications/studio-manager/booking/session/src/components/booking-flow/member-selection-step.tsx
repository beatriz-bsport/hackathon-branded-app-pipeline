import { type FC, useId, useMemo, useState } from "react";

import {
  Body,
  Button,
  List,
  type ListItemProps,
  TextField,
} from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { useSearchMembers } from "#src/hooks/member/fetch/use-search-members";
import { resetBookingFlow, setMember } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { MemberCard } from "./member-card";

export const MemberSelectionStep: FC = () => {
  const { t } = useTranslation("sessionManagement");
  const listId = useId();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debouncedSetSearch = useDebounce(setDebouncedSearch);

  const selectedMemberId = useBookingFlowStore((state) => state.memberId);

  const { data: members = [], isLoading } = useSearchMembers({
    text: debouncedSearch,
    params: { hide_archived: true },
  });

  const { data: member } = useFetchMember({
    memberId: selectedMemberId!,
  });

  const hasAccessProfilePermission = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );

  const hasReadInfoPermission = useObjectLevelPermission(
    "member.allowed_actions.readInfo",
  );

  const items = useMemo(
    (): ListItemProps[] =>
      members.map((member) => {
        const { name, first_name, last_name, id, email, photo } = member;
        const finalName = name ?? `${first_name} ${last_name}`;
        const initials =
          `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

        return {
          id: String(id),
          avatar: {
            src: photo,
            alt: finalName,
            shape: "round",
            initials,
          },
          title: finalName,
          description: hasReadInfoPermission ? email : undefined,
          isActive: id === selectedMemberId,
          onItemClick: () => {
            if (id === selectedMemberId) return;
            resetBookingFlow();
            setMember(id);
          },
          customNode: hasAccessProfilePermission ? (
            <Button
              kind="icon-button"
              icon="share-03"
              size="md"
              intent="flat"
              color="default"
              label={t("bookingFlow.memberSelection.openProfile")}
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  LEGACY_URLS.MEMBER_DETAILS(id),
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            />
          ) : undefined,
        };
      }),
    [
      members,
      selectedMemberId,
      t,
      hasAccessProfilePermission,
      hasReadInfoPermission,
    ],
  );

  return (
    <div className="flex flex-col gap-md w-full">
      <Body htmlVariant="p" size="lg" color="weak">
        {t("bookingFlow.memberSelection.description")}
      </Body>
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextField
            id="booking-flow-member-search"
            type="search"
            placeholder={t("bookingFlow.memberSelection.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSetSearch(e.target.value);
            }}
            onClear={() => {
              setSearchInput("");
              setDebouncedSearch("");
            }}
            fullWidth
            autoFocus
          />
        </div>
        <Button
          kind="default"
          iconLeft="user-plus-01"
          label={t("bookingFlow.memberSelection.createProfile")}
          intent="default"
          size="md"
          color="main"
          onClick={() =>
            window.open(LEGACY_URLS.ADD_MEMBER, "_blank", "noopener,noreferrer")
          }
        />
      </div>
      {selectedMemberId && member && (
        <MemberCard
          member={member}
          handleUnselectMember={() => resetBookingFlow()}
        />
      )}
      <div className="h-[400px] overflow-y-auto">
        <List
          id={listId}
          items={items}
          className="h-full"
          loadingProps={{
            isLoading,
            message: t("bookingFlow.memberSelection.loading"),
          }}
          emptyStateProps={{
            isEmpty:
              (members.length === 0 || searchInput.trim().length === 0) &&
              !isLoading,
            emptyConfig: {
              title: "",
              subtitle: t("bookingFlow.memberSelection.emptyTitle"),
            },
            isEmptySearch:
              debouncedSearch.trim().length > 0 &&
              !isLoading &&
              members.length === 0,
            emptySearchConfig: {
              subtitle: t("bookingFlow.memberSelection.emptySearch"),
            },
          }}
        />
      </div>
    </div>
  );
};
