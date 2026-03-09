import { type FC, useEffect } from "react";
import { Link } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import {
  Breadcrumbs,
  Button,
  ListLayout,
  Loader,
  Table,
  toast,
} from "@bsport/kaizen-primitive-core";
import {
  archiveGroupActivityAction,
  unarchiveGroupActivityAction,
} from "@bsport/store-booking-group-activity";

import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import useTableColumns from "#src/hooks/useTableColumns";
import { ROUTES } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const ArchivedGroupActivitiesList: FC = () => {
  const { t } = useTranslation("groupActivity");
  const columns = useTableColumns<MetaActivity>();

  const { fetchGroupActivities, groupActivities, paginationProps, isLoading } =
    usePaginatedGroupActivities({ customerEnabled: false });

  const revertUnarchiveGroupActivity = (groupActivityId: number) => () => {
    archiveGroupActivityAction(fetch, groupActivityId.toString()).then(
      (response) => {
        response.fold(
          () => fetchGroupActivities(),
          (error) => console.error(error),
        );
      },
    );
  };

  const handleUnarchiveGroupActivity = (groupActivityId: number) => () => {
    if (!groupActivityId) return;
    unarchiveGroupActivityAction(fetch, groupActivityId.toString()).then(
      (response) => {
        response.fold(
          ({ name }) => {
            toast({
              status: "default",
              icon: "unarchive",
              description: t("list.toasts.unarchive", {
                groupActivityName: name,
              }),
              duration: 5000,
              buttonLabel: t("list.toasts.undo"),
              onButtonClick: revertUnarchiveGroupActivity(groupActivityId),
            });
            fetchGroupActivities();
          },
          (error) => console.error(error),
        );
      },
    );
  };

  useEffect(() => {
    fetchGroupActivities();
  }, [fetchGroupActivities]);

  return (
    <ListLayout>
      <ListLayout.Header
        BreadcrumbsItems={[
          <Link key="to-active-group-activities" to={ROUTES.ACTIVE}>
            <Breadcrumbs.Item
              text={t("list.header.groupActivities")}
              id="breadcrumb-item-group-activities"
            />
          </Link>,
        ]}
        pageTitle={t("list.header.archivedGroupActivities")}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content>
          <Table<MetaActivity>
            id="enabled-group-activities-list"
            columns={[
              ...columns,
              {
                header: "",
                id: "actions",
                keyPath: "actions",
                type: "custom",
                render: (item) => {
                  return (
                    <div className="flex flex-row gap-sm">
                      <Button
                        iconLeft="unarchive"
                        intent="default"
                        color="main"
                        size="md"
                        label={t("list.actions.unarchive")}
                        onClick={handleUnarchiveGroupActivity(item.id)}
                      />
                    </div>
                  );
                },
              },
            ]}
            emptyStateProps={{
              isEmpty: !paginationProps.totalItems,
              emptyConfig: {
                title: t("list.enabled.emptyState.title"),
              },
            }}
            paginationProps={paginationProps}
            rows={groupActivities}
          />
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};
