import { type FC } from "react";
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

import { useClassesList } from "#src/hooks/use-classes-list";
import useTableColumns from "#src/hooks/use-table-columns";
import { ROUTES } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const ArchivedClassesList: FC = () => {
  const { t } = useTranslation("list");
  const columns = useTableColumns<MetaActivity>();

  const {
    refetch: fetchGroupActivities,
    classes: groupActivities,
    paginationProps,
    isLoading,
  } = useClassesList({ customerEnabled: false });

  const revertUnarchiveClass = (classId: number) => () => {
    archiveGroupActivityAction(fetch, classId.toString()).then((response) => {
      response.fold(
        () => fetchGroupActivities(),
        (error) => console.error(error),
      );
    });
  };

  const handleUnarchiveClass = (classId: number) => () => {
    if (!classId) return;
    unarchiveGroupActivityAction(fetch, classId.toString()).then((response) => {
      response.fold(
        ({ name }) => {
          toast({
            status: "default",
            icon: "unarchive",
            description: t("list.toasts.unarchive", {
              className: name,
            }),
            duration: 5000,
            buttonLabel: t("list.toasts.undo"),
            onButtonClick: revertUnarchiveClass(classId),
          });
          fetchGroupActivities();
        },
        (error) => console.error(error),
      );
    });
  };

  return (
    <ListLayout>
      <ListLayout.Header
        BreadcrumbsItems={[
          <Link key="to-active-classes" to={ROUTES.ACTIVE}>
            <Breadcrumbs.Item
              text={t("list.header.classes")}
              id="breadcrumb-item-classes"
            />
          </Link>,
        ]}
        pageTitle={t("list.header.archivedClasses")}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content>
          <Table<MetaActivity>
            id="archived-classes-list"
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
                        onClick={handleUnarchiveClass(item.id)}
                      />
                    </div>
                  );
                },
              },
            ]}
            emptyStateProps={{
              isEmpty: !paginationProps.totalItems,
              emptyConfig: {
                title: t("list.state.empty.title"),
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

export default ArchivedClassesList;
