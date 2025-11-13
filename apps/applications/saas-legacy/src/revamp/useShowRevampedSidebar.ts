/**
 * Return whether the revamped navigation sidebar should be displayed, base on DB data or cheat code.
 * @param enabledForUser Whether the revamp is enabled at the user level. Can be extracted from props.revampedBackofficeEnabled
 * @param enabledInTheme Whether the revamp is enabled at the company theme level. Can be extracted from props.theme.revamped_backoffice_enabled
 */
export const useShowRevampedSidebar = ({
  enabledForUser,
  enabledInTheme,
}: {
  enabledForUser: boolean;
  enabledInTheme: boolean;
}) => {
  return enabledForUser && enabledInTheme;
};
