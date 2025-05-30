import React from 'react';

type CursorPaginationData = {
  next_cursor?: string | null;
  previous_cursor?: string | null;
};

type UseCursorPaginationProps = {
  data: CursorPaginationData;
  onNavigate: (params: { cursor: string }) => void;
};

export const useCursorPagination = ({
  data,
  onNavigate,
}: UseCursorPaginationProps) => {
  const handleNext = React.useCallback(() => {
    if (data.next_cursor) {
      onNavigate({ cursor: data.next_cursor });
    }
  }, [data.next_cursor, onNavigate]);

  const handlePrevious = React.useCallback(() => {
    if (data.previous_cursor) {
      onNavigate({ cursor: data.previous_cursor });
    }
  }, [data.previous_cursor, onNavigate]);

  return {
    handleNext,
    handlePrevious,
    hasNext: !!data.next_cursor,
    hasPrevious: !!data.previous_cursor,
  };
};
