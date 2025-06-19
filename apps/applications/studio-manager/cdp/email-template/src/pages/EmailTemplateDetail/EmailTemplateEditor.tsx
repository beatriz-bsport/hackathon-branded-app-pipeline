import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

import {
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { PageListContent } from "#src/components/TemplateDetails/PageListContent";
import { useSaveTemplate } from "#src/hooks/actions/useSaveTemplate";
import { useFetchCategoriesPaginatedList } from "#src/hooks/fetch/useFetchPaginatedCategoriesList";
import { useFetchTemplateDetail } from "#src/hooks/fetch/useFetchTemplateDetails";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";

const EmailTemplateEditor = () => {
  const { pathname } = useLocation();
  const params = useParams();
  const rawId = Number(params?.id);
  const emailTemplateId = Number.isFinite(rawId) ? rawId : undefined;
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();
  const { navigateToCustomList, navigateToCreateTemplate } =
    useTemplateNavigation();
  const { categoriesList, fetchCategories } = useFetchCategoriesPaginatedList();
  const {
    isLoading: emailTemplateLoading,
    isTemplateFetched,
    emailTemplateDetail,
    fetchEmailTemplateDetail,
  } = useFetchTemplateDetail({ emailTemplateId: emailTemplateId ?? null });
  const { saveTemplate } = useSaveTemplate({
    templateId: emailTemplateId,
    onSuccess: navigateToCustomList,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (emailTemplateId && typeof emailTemplateId === "number") {
      fetchEmailTemplateDetail({ id: emailTemplateId });
    }
  }, [emailTemplateId, fetchEmailTemplateDetail]);

  useEffect(() => {
    const isAlreadyOnCreatePath = pathname.includes("create");
    const shouldNavigateToCreate =
      !emailTemplateId || (isTemplateFetched && !emailTemplateDetail);

    if (!isAlreadyOnCreatePath && shouldNavigateToCreate) {
      navigateToCreateTemplate();
    }
  }, [
    pathname,
    emailTemplateId,
    isTemplateFetched,
    emailTemplateDetail,
    navigateToCreateTemplate,
  ]);

  return (
    <DetailsLayout {...detailsLayoutProps}>
      {emailTemplateLoading ? (
        <Loader size="lg">Loading ...</Loader>
      ) : (
        <PageListContent
          emailTemplateDetail={emailTemplateDetail || null}
          categoriesList={categoriesList}
          toggleHasUnsavedChanges={toggleHasUnsavedChanges}
          saveTemplate={saveTemplate}
        />
      )}
    </DetailsLayout>
  );
};
export default EmailTemplateEditor;
