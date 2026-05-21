import { type ReactNode } from "react";
import { Link } from "react-router";

import {
  Alert,
  Breadcrumbs,
  DetailsLayout,
  Loader,
  type UseDetailsLayoutReturnType,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

interface InsightDetailLayoutProps {
  title: string;
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
  withPanel?: boolean;
  panelChildren?: ReactNode;
  detailsLayoutProps?: UseDetailsLayoutReturnType["detailsLayoutProps"];
}

/**
 * Shared layout component for insight detail pages.
 * Provides consistent header, breadcrumbs, loading, and error states.
 */
export const InsightDetailLayout = ({
  title,
  isLoading,
  error,
  children,
  withPanel,
  panelChildren,
  detailsLayoutProps: externalLayoutProps,
}: InsightDetailLayoutProps) => {
  const { t } = useTranslation("insights");
  const { detailsLayoutProps: internalLayoutProps } = useDetailsLayout();
  const layoutProps = externalLayoutProps ?? internalLayoutProps;

  const breadcrumbsItems = [
    <Link key="insights-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id="breadcrumb-insights" text={t("pageTitle")} />
    </Link>,
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-full p-md">
          <Alert status="critical" title={error} />
        </div>
      );
    }

    return children;
  };

  return (
    <DetailsLayout {...layoutProps} withPanel={withPanel}>
      <DetailsLayout.Header
        pageTitle={title}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <div
        style={{ gridArea: "content" }}
        className="w-full h-full p-0 overflow-hidden"
      >
        {renderContent()}
      </div>
      {withPanel && <DetailsLayout.Panel>{panelChildren}</DetailsLayout.Panel>}
    </DetailsLayout>
  );
};
