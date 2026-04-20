import { type FC } from "react";
import { useNavigate } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import {
  Button,
  type ButtonProps,
  ListLayout,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useClassesList } from "#src/hooks/use-classes-list";
import useTableColumns from "#src/hooks/use-table-columns";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Row = MetaActivity & {
  color: string;
  // link: string;
};

const ClassesTable: FC = () => {
  const { t } = useTranslation("list");
  const columns = useTableColumns<Row>();
  const { classes: renderedClasses, paginationProps } = useClassesList({
    customerEnabled: true,
  });

  return (
    <Table<Row>
      id="enabled-classes-list"
      columns={[
        ...columns,
        {
          header: "",
          id: "actions",
          type: "custom",
          render: () => {
            return (
              <div className="flex flex-row gap-sm">
                <Button
                  kind="icon-button"
                  icon="copy-03"
                  intent="flat"
                  color="default"
                  label={t("list.actions.duplicate")}
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: implement duplicate modal
                  }}
                />
                <Button
                  kind="icon-button"
                  icon="archive"
                  intent="flat"
                  color="default"
                  label={t("list.actions.archive")}
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: implement archive modal
                  }}
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
          subtitle: t("list.state.empty.subtitle"),
          ctaButtonConfig: {
            label: t("list.state.empty.cta"),
            // TODO: wire the add button
            onClick: () => null,
            iconLeft: "plus",
          },
        },
      }}
      paginationProps={paginationProps}
      rows={renderedClasses}
    />
  );
};

// Outer component — owns the layout and the QueryBoundary.
// The header renders immediately; only the table area suspends.
const ClassesListingPage: FC = () => {
  const { t } = useTranslation("list");

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedLink
        key="link-to-archive"
        kind="icon-button"
        label={t("list.header.archivedClasses")}
        icon="archive"
        intent="default"
        color="main"
        size="md"
      />,
    ],
  });

  return (
    <ListLayout>
      <ListLayout.Header
        endGroupActions={endGroupActions}
        callToActionButton={
          // TODO: wire the add button
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("list.header.add")}
          />
        }
        pageTitle={t("list.header.classes")}
      />
      <ListLayout.Content className="flex flex-col gap-sm">
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <ClassesTable />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

function GoToArchivedLink(props: ButtonProps) {
  const navigate = useNavigate();

  return <Button {...props} onClick={() => navigate(ROUTES.ARCHIVED)} />;
}

export default ClassesListingPage;
