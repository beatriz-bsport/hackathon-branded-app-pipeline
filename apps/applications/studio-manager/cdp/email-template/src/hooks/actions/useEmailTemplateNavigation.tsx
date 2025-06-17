import { useNavigate } from "react-router";

import { ROUTES } from "#src/urls";

export const useEmailTemplateNavigation = () => {
  const navigate = useNavigate();

  const navigateToEmailTemplateDetail = (emailTemplateId: number) => {
    navigate(`${ROUTES.EMAIL_TEMPLATE_EDIT}/${emailTemplateId}`);
  };

  const navigateToCreateEmailTemplate = () => {
    navigate(`/email-template/${ROUTES.EMAIL_TEMPLATE_CREATE}`);
  };

  return {
    navigateToEmailTemplateDetail,
    navigateToCreateEmailTemplate,
  };
};
