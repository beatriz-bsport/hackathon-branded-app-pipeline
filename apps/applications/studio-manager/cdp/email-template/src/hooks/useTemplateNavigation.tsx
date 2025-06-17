import { useNavigate } from "react-router";

import { ROUTES } from "#src/urls";

export const useTemplateNavigation = () => {
  const navigate = useNavigate();

  const navigateToCreateTemplate = () => {
    navigate(`../${ROUTES.EMAIL_TEMPLATE_CREATE}`);
  };

  const navigateToTemplateDetails = (templateId: number) => {
    navigate(`../${ROUTES.EMAIL_TEMPLATE_EDIT(templateId)}`);
  };

  const navigateToCustomList = () => {
    navigate(`../${ROUTES.CUSTOM_TEMPLATES}`);
  };
  return {
    navigateToCreateTemplate,
    navigateToTemplateDetails,
    navigateToCustomList,
  };
};
