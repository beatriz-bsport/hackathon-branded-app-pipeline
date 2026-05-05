import { Link } from "react-router";

import {
  Breadcrumbs,
  Button,
  DetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useCollectionDetailsHeader = ({
  onAddMediaClick,
  onDeleteClick,
}: {
  onAddMediaClick?: () => void;
  onDeleteClick: () => void;
}) => {
  const { t } = useTranslation("collection-details");

  const breadcrumbs = [
    <Link key="link-to-collection-list" to={`${URLS.INDEX}/${URLS.COLLECTION}`}>
      <Breadcrumbs.Item text={t("breadcrumbLabel")} />
    </Link>,
  ];

  const { endGroupActions, startGroupActions } =
    DetailsLayout.useAdaptiveActions({
      endGroupActions: [
        <Button
          key="collection-details-button-delete"
          color="default"
          intent="flat"
          size="md"
          icon="trash-01"
          kind="icon-button"
          label={t("deleteActionLabel")}
          onClick={onDeleteClick}
        />,
      ],
    });

  const callToActionButton = onAddMediaClick ? (
    <Button
      key="collection-details-button-add-media"
      label={t("videoList.addMedia")}
      iconLeft="plus"
      intent="call-to-action"
      color="main"
      size="md"
      onClick={onAddMediaClick}
    />
  ) : undefined;

  return {
    BreadcrumbsItems: breadcrumbs,
    callToActionButton,
    endGroupActions,
    startGroupActions,
  };
};
