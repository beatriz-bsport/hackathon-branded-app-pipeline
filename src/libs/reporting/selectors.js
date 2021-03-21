export const getReportRows = (state, reportId) => {
  const rows = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].result
    : null;
  return rows;
};

export const getReportRowsLoading = (state) => {
  return state.reports.loading;
};

export const getNextPage = (state, reportId) => {
  const nextPage = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].next_page
    : null;
  return nextPage;
};

export const getPreviousPage = (state, reportId) => {
  const previousPage = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].previous_page
    : null;
  return previousPage;
};

export const getOtherPages = (state, reportId) => {
  const otherPages = Object.keys(state.reports.reportResponse).includes(
    reportId.toString(),
  )
    ? state.reports.reportResponse[reportId].other_pages
    : null;
  return otherPages;
};

export const getPageSize = (state) => {
  return state.reports.reportResponse.page_size;
};
