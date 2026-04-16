import { useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { Link } from "react-router";

import { type MetaActivity, groupActivityKeys } from "@bsport/api-book";
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

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useClassesList } from "#src/hooks/use-classes-list";
import useTableColumns from "#src/hooks/use-table-columns";
import { ROUTES } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

// Inner component — renders only when data is ready (useSuspenseQuery guaranteed).
// Also owns the mutation handlers since they depend on the data context.
const ArchivedClassesTable: FC = () => {
  const { t } = useTranslation("list");
  const columns = useTableColumns<MetaActivity>();
  const queryClient = useQueryClient();

  const { classes: groupActivities, paginationProps } = useClassesList({
    customerEnabled: false,
  });

  const handleInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: groupActivityKeys.searches() });
  };

  const revertUnarchiveClass = (classId: number) => () => {
    archiveGroupActivityAction(fetch, classId.toString()).then((response) => {
      response.fold(
        () => handleInvalidate(),
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
          handleInvalidate();
        },
        (error) => console.error(error),
      );
    });
  };

  return (
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
  );
};

// Outer component — owns the layout and the QueryBoundary.
// The header/breadcrumbs render immediately; only the table area suspends.
export const ArchivedClassesList: FC = () => {
  const { t } = useTranslation("list");

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
      <ListLayout.Content>
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <ArchivedClassesTable />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ArchivedClassesList;
