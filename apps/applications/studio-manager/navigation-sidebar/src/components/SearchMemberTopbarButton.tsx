import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type SearchMemberTopbarButtonProps = {
  onClick: () => void;
};

export const SearchMemberTopbarButton = ({
  onClick,
}: SearchMemberTopbarButtonProps) => {
  const { t } = useTranslation("features");

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
