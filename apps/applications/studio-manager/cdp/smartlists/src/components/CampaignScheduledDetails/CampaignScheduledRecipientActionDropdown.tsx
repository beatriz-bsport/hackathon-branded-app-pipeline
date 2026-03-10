import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useTranslation } from "#src/utils/i18n";

const NAVIGATE_TO_MEMBER_PROFILE_ACTION_ID = "navigate-to-member-profile";
const COPY_EMAIL_ACTION_ID = "copy-email";
const COPY_PHONE_NUMBER_ACTION_ID = "copy-phone-number";
const COPY_NAME_ACTION_ID = "copy-name";

type CampaignScheduledRecipientActionMenuProps = {
  /*
   * The contact info is a string that contains either the email, the phone number or the client name.
   * Example: "john.doe@example.com", "+3465656789", "John Doe"
   * Communication kind => contactInfo value
   * PUSH => "John Doe"
   * EMAIL => "john.doe@example.com"
   * SMS => "+3465656789"
   * */
  contactInfo: string;
  memberId: number;
  campaignKind: CommunicationKind;
  navigateToMemberProfile: (memberId: number) => void;
  copyContactInfo: (contactInfo: string) => void;
};

export const CampaignScheduledRecipientActionDropdown = ({
  campaignKind,
  memberId,
  contactInfo,
  navigateToMemberProfile,
  copyContactInfo,
}: CampaignScheduledRecipientActionMenuProps) => {
  const { t } = useTranslation("campaign");

  const handleMenuItemClick = (itemId: string) => {
    switch (itemId) {
      case NAVIGATE_TO_MEMBER_PROFILE_ACTION_ID:
        navigateToMemberProfile(memberId);
        break;
      case COPY_EMAIL_ACTION_ID:
      case COPY_PHONE_NUMBER_ACTION_ID:
      case COPY_NAME_ACTION_ID:
        copyContactInfo(contactInfo);
        break;
      default:
        break;
    }
  };

  const getCopyActionId = (campaignKind: CommunicationKind): string => {
    const communicationKindToId = {
      [CommunicationKind.EMAIL]: COPY_EMAIL_ACTION_ID,
      [CommunicationKind.SMS]: COPY_PHONE_NUMBER_ACTION_ID,
      [CommunicationKind.PUSH]: COPY_NAME_ACTION_ID,
    };

    return communicationKindToId[campaignKind];
  };

  const getCopyActionLabel = (campaignKind: CommunicationKind): string => {
    const communicationKindToLabel = {
      [CommunicationKind.EMAIL]: t(
        "table.campaignRecipient.moreActions.copyEmail",
      ),
      [CommunicationKind.SMS]: t(
        "table.campaignRecipient.moreActions.copyPhoneNumber",
      ),
      [CommunicationKind.PUSH]: t(
        "table.campaignRecipient.moreActions.copyName",
      ),
    };

    return communicationKindToLabel[campaignKind];
  };

  const menuItems: Item[] = [
    {
      id: NAVIGATE_TO_MEMBER_PROFILE_ACTION_ID,
      label: t("table.campaignRecipient.moreActions.navigateToMemberProfile"),
      iconLeft: "share-03",
    },
    {
      id: getCopyActionId(campaignKind),
      label: getCopyActionLabel(campaignKind),
      iconLeft: "copy-07",
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("table.campaignRecipient.moreActions.label")}
            icon="dots-vertical"
            color="default"
            intent="flat"
            size="md"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              event.stopPropagation();
              setIsPopoverOpened((opened) => !opened);
            }}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <div className="flex flex-col gap-sm">
            <Menu
              items={menuItems}
              onSelectOption={(value) => {
                setIsPopoverOpened(false);
                handleMenuItemClick(value);
              }}
            />
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
