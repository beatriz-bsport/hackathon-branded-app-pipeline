import { useNavigate } from "react-router";

import { ROUTES } from "#src/urls";

export const useEmailTemplateNavigation = () => {
  const navigate = useNavigate();

  const navigateToEmailTemplateDetail = (emailTemplateId: number) => {
    /** @todo Finalize routing when the routes have been fixed */
    window.location.assign(
      `${ROUTES.LEGACY_EMAIL_TEMPLATE_DETAIL}/${emailTemplateId}`,
    );
  };

  const navigateToCreateEmailTemplate = () => {
    /** @todo Finalize routing when the routes have been fixed */
    navigate(`/email-template/${ROUTES.EMAIL_TEMPLATE_CREATE}`);
  };

  return {
    navigateToEmailTemplateDetail,
    navigateToCreateEmailTemplate,
  };
};
