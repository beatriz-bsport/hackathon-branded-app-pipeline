import { type ReactNode } from "react";
import { Link } from "react-router";

import {
  Alert,
  Breadcrumbs,
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import type { ErrorKeys } from "#src/hooks/api/usePresignedUrl";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

interface InsightDetailLayoutProps {
  title: string;
  isLoading: boolean;
  error: ErrorKeys | null;
  children: ReactNode;
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
}: InsightDetailLayoutProps) => {
  const { t } = useTranslation("insights");
  const { detailsLayoutProps } = useDetailsLayout();

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
          <Alert status="critical" title={t(error)} />
        </div>
      );
    }

    return children;
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
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
    </DetailsLayout>
  );
};
