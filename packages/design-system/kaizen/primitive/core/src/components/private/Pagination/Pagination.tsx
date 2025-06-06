import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Divider from "#src/components/Divider";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const defaultClasses = [
  "flex",
  "flex-row",
  "flex-wrap",
  "w-auto",
  "h-lg",
  "items-center",
  "content-center",
  "gap-y-sm",
  "m-xs",
] as const;

const buttonClasses = [
  "flex",
  "w-element-md",
  "h-element-md",
  "justify-center",
  "items-center",
  "flex-shrink-0",
  "rounded-sm",
  "hover:bg-surface-action-default-weak-hovered",
  "active:bg-surface-action-default-weak-pressed",
] as const;

const buttonVariants = {
  active: {
    true: [
      "bg-surface-action-default-elevated-rest",
      "shadow-action-default-rest",
    ],
    false: ["bg-surface-action-default-weak-rest"],
  },
  disabled: {
    true: ["pointer-events-none", "opacity-md"],
    false: [],
  },
} as const;

const pagination = cva(defaultClasses);

const button = cva(buttonClasses, { variants: buttonVariants });

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

export type PaginationProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pagination> & {
    currentPage: number;
    rowsPerPage: number | undefined;
    totalItems: number;
    showRowsPerPageSelector?: boolean;
    disabled?: boolean;
    onPageSettingsChange?: (page: number, rowsPerPage: number) => void;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
  };

/**
 * Pagination component for navigating through large sets of data, allowing navigation between pages
 * and the option to adjust the number of rows displayed per page. It includes support for boundary
 * and range-based page selection as well as a rows-per-page selector.
 * @param props.className Custom classes for the root pagination container.
 * @param props.currentPage The current page number (1-based).
 * @param props.rowsPerPage The number of rows per page. Defaults to 10.
 * @param props.totalItems The total number of items in the dataset.
 * @param props.showRowsPerPageSelector Whether to display a selector for rows per page.
 * @param props.disabled Whether the pagination buttons are disabled.
 * @param props.onPageSettingsChange Callback for handling changes to both the page number and the rows selector.
 * @param props.onPageChange Callback for handling page changes. Receives the new page number as an argument.
 * @param props.onRowsPerPageChange Callback for handling rows per page changes. Receives the new rowsPerPage value as an argument.
 */
const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  rowsPerPage = 10,
  totalItems,
  showRowsPerPageSelector = false,
  disabled = false,
  onPageSettingsChange,
  onPageChange,
  onRowsPerPageChange,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const [localRowsPerPage, setLocalRowsPerPage] = useState(rowsPerPage);

  useEffect(() => {
    if (rowsPerPage != localRowsPerPage) {
      setLocalRowsPerPage(rowsPerPage);
    }
  }, [localRowsPerPage, rowsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / Math.max(localRowsPerPage, 1)),
    [totalItems, localRowsPerPage],
  );

  const currentItems = useMemo(
    () => Math.min(totalItems, localRowsPerPage),
    [totalItems, localRowsPerPage],
  );

  const currentItemsRendered = useMemo(() => {
    return currentPage === totalPages
      ? totalItems % localRowsPerPage || localRowsPerPage
      : localRowsPerPage;
  }, [currentPage, totalItems, totalPages, localRowsPerPage]);

  useEffect(() => {
    const validPage = Math.max(1, Math.min(currentPage, totalPages));

    if (currentPage !== validPage) {
      console.warn(
        `Current page ${currentPage} is out of range. Adjusting to valid range.`,
      );
      onPageChange?.(validPage);
      onPageSettingsChange?.(validPage, rowsPerPage);
    }
  }, [
    currentPage,
    onPageChange,
    onPageSettingsChange,
    rowsPerPage,
    totalPages,
  ]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange?.(page);
        onPageSettingsChange?.(page, rowsPerPage);
      }
    },
    [onPageChange, onPageSettingsChange, rowsPerPage, totalPages],
  );

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLocalRowsPerPage(Number(event.target.value));
    onRowsPerPageChange?.(Number(event.target.value));
    onPageSettingsChange?.(1, Number(event.target.value));
  };

  const getPages = useCallback((): string[] => {
    const addRange = (start: number, end: number) => {
      const rangeLength = end - start + 1;
      return Array.from({ length: rangeLength }, (_, i) =>
        (start + i).toString(),
      );
    };

    if (currentPage <= 5) {
      return [
        ...addRange(1, Math.min(7, totalPages)),
        ...(totalPages > 7 ? ["...", totalPages.toString()] : []),
      ];
    }
    if (currentPage + 5 <= totalPages) {
      return [
        "1",
        "...",
        ...addRange(currentPage - 2, currentPage + 2),
        "...",
        totalPages.toString(),
      ];
    }
    return ["1", "...", ...addRange(Math.max(1, totalPages - 6), totalPages)];
  }, [currentPage, totalPages]);

  const pages = useMemo(getPages, [getPages]);

  const rowsPerPageOptions = useMemo(
    () =>
      Array.from(
        new Set([...DEFAULT_ROWS_PER_PAGE_OPTIONS, currentItems, rowsPerPage]),
      )
        .filter(
          (value) =>
            value > 0 && value <= totalItems && Number.isInteger(value),
        )
        .sort((a, b) => a - b),
    [currentItems, totalItems, rowsPerPage],
  );

  if (totalItems <= 0 || localRowsPerPage <= 0) {
    console.error("Invalid pagination parameters. Skipping pagination.");
    return null;
  }

  return (
    <div
      className={classNames(pagination({ className }), {
        "justify-between": showRowsPerPageSelector,
        "justify-center": !showRowsPerPageSelector,
      })}
      {...props}
    >
      <div className="flex items-center gap-2xs">
        {rowsPerPageOptions.length > 1 && showRowsPerPageSelector && (
          <>
            <Body htmlVariant="span" size="sm" color="weak" weight="weak">
              {t("pagination.rows")}
            </Body>
            {/* TODO: use <Select> component here instead */}
            <select
              value={currentItems}
              onChange={handleRowsPerPageChange}
              className="rounded-sm bg-surface-action-default-elevated-rest shadow-action-default-rest text-onsurface-action-weak-default text-body-md leading-xs"
              disabled={disabled}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <div className="flex items-center gap-xs h-full">
        {showRowsPerPageSelector && (
          <>
            <Body htmlVariant="p" size="sm" color="weak" weight="weak">
              {/* TODO: Translation */}
              {`Showing ${currentItemsRendered} of ${totalItems}`}
            </Body>
            {totalPages > 1 && <Divider orientation="vertical" weight="thin" />}
          </>
        )}
        {totalPages > 1 && (
          <>
            <Button
              intent="flat"
              color="default"
              size="sm"
              iconLeft="chevron-left-double"
              aria-label="First page"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || disabled}
            />
            <Button
              intent="flat"
              color="default"
              size="sm"
              iconLeft="chevron-left"
              aria-label="Previous page"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
            />
            <div className="flex gap-2xs">
              {pages.map((page, index) => (
                <button
                  className={button({
                    active: currentPage === parseInt(page),
                    disabled,
                  })}
                  key={index}
                  aria-label={`Page ${page}`}
                  disabled={disabled}
                  onClick={() => handlePageChange(parseInt(page))}
                >
                  <span className="flex w-element-sm justify-center items-center shrink-0 text-onsurface-default text-body-sm font-weak leading-xs">
                    {page}
                  </span>
                </button>
              ))}
            </div>
            <Button
              intent="flat"
              color="default"
              size="sm"
              iconLeft="chevron-right"
              aria-label="Next page"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
            />
            <Button
              intent="flat"
              color="default"
              size="sm"
              iconLeft="chevron-right-double"
              aria-label="Last page"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || disabled}
            />
          </>
        )}
      </div>
    </div>
  );
};

Pagination.displayName = "KaizenPagination";

export default Pagination;
