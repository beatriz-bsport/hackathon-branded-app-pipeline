import { useState } from "react";

import { DEFAULT_PAGE, PAGE_SIZE } from "./constants";

export const usePagination = () => {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return {
    page,
    onPageChange,
    pageSize: PAGE_SIZE,
  };
};
