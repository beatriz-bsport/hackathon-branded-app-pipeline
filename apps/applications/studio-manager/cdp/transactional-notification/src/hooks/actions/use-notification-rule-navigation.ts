import { useNavigate } from "react-router";

export const useNotificationRuleNavigation = () => {
  const navigate = useNavigate();

  const navigateToNotificationGroupDetails = (notificationRuleId: string) => {
    navigate(`../${notificationRuleId}`);
  };

  return {
    navigateToNotificationGroupDetails,
  };
};
