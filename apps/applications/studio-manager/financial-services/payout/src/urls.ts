// TODO: Sync with BI when reports are revamped
const REPORTS_URL = "/reporting/categories";

export const navigateToReports = () => {
  window.open(REPORTS_URL, "_blank", "noopener,noreferrer");
};
