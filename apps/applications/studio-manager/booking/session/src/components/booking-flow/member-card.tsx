import { type FC } from "react";

import { MemberDetail } from "@bsport/api-cdp/member";
import { Avatar, Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

export const MemberCard: FC<{
  member: Pick<MemberDetail, "email" | "photo" | "name">;
  handleUnselectMember?: () => void;
}> = ({ member, handleUnselectMember }) => {
  const { t } = useTranslation("sessionManagement");

  const hasReadInfoPermission = useObjectLevelPermission(
    "member.allowed_actions.readInfo",
  );

  return (
    // TODO: Create a variant of Card without padding and use it here instead of overriding with CSS
    <Card className="bg-surface-page-navigation border-none">
      <div className="flex justify-between">
        <div className="flex items-center gap-sm">
          <Avatar src={member.photo} shape="round" size="md" />
          <div className="flex flex-col">
            <Body size="lg">{member.name}</Body>
            {hasReadInfoPermission && (
              <Body size="md" color="weak">
                {member.email}
              </Body>
            )}
          </div>
        </div>
        {handleUnselectMember && (
          <Button
            label={t("bookingFlow.memberSelection.unselect")}
            color="default"
            intent="flat"
            kind="icon-button"
            icon="x-close"
            size="md"
            onClick={handleUnselectMember}
          />
        )}
      </div>
    </Card>
  );
};
