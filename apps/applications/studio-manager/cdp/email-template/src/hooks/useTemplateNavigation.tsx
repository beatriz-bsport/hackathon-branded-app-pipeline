import { useNavigate } from "react-router";

import { LEGACY_URLS, ROUTES } from "#src/urls";

export const useTemplateNavigation = () => {
  const navigate = useNavigate();

  const navigateToCreateTemplate = () => {
    window?.location?.assign(LEGACY_URLS.CREATE_EMAIL_TEMPLATE());
  };

  const navigateToTemplateDetails = (templateId: number) => {
    window?.location?.assign(LEGACY_URLS.EDIT_EMAIL_TEMPLATE(templateId));
  };

  const navigateToCustomList = () => {
    navigate(`/email-template/${ROUTES.CUSTOM_TEMPLATES}`);
  };
  return {
    navigateToCreateTemplate,
    navigateToTemplateDetails,
    navigateToCustomList,
  };
};
