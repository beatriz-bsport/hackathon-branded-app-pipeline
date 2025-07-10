import { useNavigate } from "react-router";

/**
 * Return a navigate function that handles all the contexts:
 * - Legacy (Bridged) vs Revamped context
 * - Legacy vs Revamped URL
 * @param navigate Legacy navigate function (history.push)
 * @param revampNavigate React router navigate function
 */
export const useNavigateInContext = (navigate?: (to: string) => void) => {
  let revampNavigate = undefined;
  if (!navigate) {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      revampNavigate = useNavigate();
    } catch (error) {
      // A safeguard. It should never come to here as we are removing the case
      // Where the Navigation Sidebar is not in a react context (when Bridged)
      console.error(error);
    }
  }

  /**
   * Perform a navigation with the right function based on the context
   * @param to URL to redirect to
   * @param isRevamped Whether the URL is a revamped link
   */
  const navigateInContext = (to: string, isRevamped?: boolean): void => {
    if (!!navigate && !isRevamped) {
      // In Legacy context, navigate to legacy link using navigate
      navigate(to);
      return;
    }
    if (!!navigate && isRevamped) {
      // In Legacy context, navigate to revamped link using redirection
      window.location.assign(`/studio${to}`);
      return;
    }
    if (!navigate && !isRevamped) {
      // In Revamp context, navigate to legacy link using redirection
      window.location.assign(to);
      return;
    }
    if (!navigate && revampNavigate && isRevamped) {
      // In Revamp context, navigate to revamp link using React router navigate
      revampNavigate(to);
      return;
    }
    // Fallback
    window.location.assign(to);
  };

  return navigateInContext;
};
