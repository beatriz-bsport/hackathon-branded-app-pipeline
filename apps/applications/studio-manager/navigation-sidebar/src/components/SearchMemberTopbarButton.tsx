import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permissions";

type SearchMemberTopbarButtonProps = {
  onClick: () => void;
};

export const SearchMemberTopbarButton = ({
  onClick,
}: SearchMemberTopbarButtonProps) => {
  const { t } = useTranslation("features");

  const hasSearchPermission = useObjectLevelPermission(
    "member.allowed_actions.search",
  );

  if (!hasSearchPermission) {
    return null;
  }

  return (
    <Button
      intent="default"
      size="md"
      color="main"
      iconLeft="user-search"
      label={t("searchMembers.title")}
      onClick={onClick}
    />
  );
};
