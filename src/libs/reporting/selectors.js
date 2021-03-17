export const getReportRows = (state) => {
  return state.reports.reportResponse.result;
};

export const getReportRowsLoading = (state) => {
  return state.reports.loading;
};

export const getNextPage = (state) => {
  return state.reports.reportResponse.next_page;
};

export const getPreviousPage = (state) => {
  return state.reports.reportResponse.previous_page;
};

export const getOtherPages = (state) => {
  return state.reports.reportResponse.other_pages;
};

export const getPageSize = (state) => {
  return state.reports.reportResponse.page_size;
};
