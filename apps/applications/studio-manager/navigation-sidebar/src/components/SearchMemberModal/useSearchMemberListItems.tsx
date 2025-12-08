import {
  type ActionButton,
  type ListItemProps,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import {
  type Member,
  addMemberToSearchHistoryAction,
} from "@bsport/store-core-data-member";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permissions";

import { SearchMemberInlineActions } from "./SearchMemberInlineActions";
import type { TagsMap } from "./constants";

const MOBILE_MAX_EMAIL_SIZE = 20;

/**
 * Format the members in a items for the List, with a mobile variant
 * @param isMobile Whether to use the mobile display
 * @param members The list of members to display (either history or current search)
 */
export const useSearchMemberListItems = ({
  isMobile,
  members,
  tagsMap,
  navigate,
}: {
  isMobile: boolean;
  members: Member[];
  tagsMap: TagsMap;
  navigate: (to: string) => void;
}): Array<ListItemProps> => {
  const { t } = useTranslation("features");

  const hasReadPermission = useObjectLevelPermission(
    "member.allowed_actions.readInfo",
  );

  const sharedTranslations = {
    copyEmailLabel: t("searchMembers.copyToClipboard.copyEmail"),
    copyPhoneLabel: t("searchMembers.copyToClipboard.copyPhone"),
    toastEmailCopied: t("searchMembers.copyToClipboard.toasts.emailCopied"),
    toastPhoneCopied: t(
      "searchMembers.copyToClipboard.toasts.phoneNumberCopied",
    ),
    tagsTooltip: t("searchMembers.tagsTooltip"),
  };

  const { copyToClipboard: copyEmail } = useCopyToClipboard({
    toastMessage: sharedTranslations.toastEmailCopied,
  });
  const { copyToClipboard: copyPhone } = useCopyToClipboard({
    toastMessage: sharedTranslations.toastPhoneCopied,
  });

  return members.map((member) => {
    const { name, first_name, last_name, id, phone, email, photo, tags } =
      member;
    const finalName = name ?? `${first_name} ${last_name}`;

    const properties: ListItemProps = {
      id: String(id),
      avatar: {
        src: photo,
        alt: finalName,
        shape: "round",
        initials:
          `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase(),
      },
      title: name,
      onClick: () => {
        addMemberToSearchHistoryAction(member);
        navigate(`${LEGACY_URLS.member}/${id}/info`);
      },
    };

    if (isMobile) {
      // Actions are stacked in a Dropdown
      const buttons: ActionButton[] = [];

      const buttonBaseConfig = {
        size: "md",
        color: "default",
        intent: "flat",
      } as const;

      if (email) {
        buttons.push({
          ...buttonBaseConfig,
          id: `member-copy-email-${id}`,
          // Reduce the displayed letters as css can not be override yet
          label:
            email.length > MOBILE_MAX_EMAIL_SIZE
              ? `${email.slice(0, MOBILE_MAX_EMAIL_SIZE)}...`
              : email,
          iconLeft: "copy-07",
          disabled: !hasReadPermission,
          onClick: () => copyEmail(email),
        });
      }

      if (phone) {
        buttons.push({
          ...buttonBaseConfig,
          id: `member-copy-phone-${id}`,
          label: phone,
          iconLeft: "copy-07",
          disabled: !hasReadPermission,
          onClick: () => copyPhone(phone),
        });
      }

      properties["dropdownConfig"] = { visibleActionsDisplayLimit: 0 };
      properties["buttons"] = buttons;
    }

    if (!isMobile) {
      // Actions are injected in custom node
      properties["customNode"] = (
        <SearchMemberInlineActions
          id={id}
          translations={sharedTranslations}
          email={email}
          phone={phone}
          tags={tags}
          tagsMap={tagsMap}
        />
      );
    }

    return properties;
  });
};
