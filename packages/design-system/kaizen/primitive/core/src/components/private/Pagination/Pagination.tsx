import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Divider from "#src/components/Divider";
import Select from "#src/components/Select";
import Tooltip from "#src/components/Tooltip";
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
    maxVisiblePages?: number;
    onPageSettingsChange?: (page: number, rowsPerPage: number) => void;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
  };

// Helper to shorten page numbers > 999
const shortenPage = (pageNum: number) => {
  if (pageNum > 999) {
    return `..${pageNum.toString().slice(-2)}`;
  }
  return pageNum.toString();
};

type PageButton = { label: string; value: number };

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
 * @param props.maxVisiblePages Maximum number of page buttons to display (excluding ellipsis, but including [last]). Defaults to 8. Useful for responsive designs (e.g., 6 for mobile).
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
  maxVisiblePages = 8,
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

  const handleRowsPerPageChange = (option: string) => {
    setLocalRowsPerPage(Number(option));
    onRowsPerPageChange?.(Number(option));
    onPageSettingsChange?.(1, Number(option));
  };

  // Returns an array of { label, value } for each page button
  // maxVisiblePages represents the total number of page buttons shown (excluding ellipsis)
  const getPages = useCallback((): PageButton[] => {
    const addRange = (start: number, end: number) => {
      const rangeLength = end - start + 1;
      return Array.from({ length: rangeLength }, (_, i) => {
        const pageNum = start + i;
        return { label: shortenPage(pageNum), value: pageNum };
      });
    };

    // If total pages fit in maxVisiblePages, show all
    if (totalPages <= maxVisiblePages) {
      return addRange(1, totalPages);
    }

    // Scenario 1: Early pages - show [1, 2, 3, ..., maxVisiblePages-1] ... [last]
    // Reserve 1 space for last page button
    const pagesAtStart = maxVisiblePages - 1;
    const earlyThreshold = pagesAtStart;

    if (currentPage <= earlyThreshold) {
      return [
        ...addRange(1, pagesAtStart),
        { label: "...", value: -1 },
        { label: shortenPage(totalPages), value: totalPages },
      ];
    }

    // Scenario 2: Middle pages - show [1] ... [middle pages] ... [last]
    // Reserve 2 spaces for first and last page buttons
    const middlePages = maxVisiblePages - 2;
    const halfSide = Math.floor(middlePages / 2);
    const lateThreshold = totalPages - halfSide;

    if (currentPage < lateThreshold) {
      // Calculate the range to show middlePages total
      // For even middlePages: show halfSide pages on each side
      // For odd middlePages: show halfSide pages before, current, and (halfSide - 1) after
      const startPage = currentPage - halfSide;
      const endPage = startPage + middlePages - 1;

      return [
        { label: "1", value: 1 },
        { label: "...", value: -1 },
        ...addRange(startPage, endPage),
        { label: "...", value: -1 },
        { label: shortenPage(totalPages), value: totalPages },
      ];
    }

    // Scenario 3: Near end pages - show [1] ... [last maxVisiblePages-1 pages]
    // Reserve 1 space for first page button
    const pagesAtEnd = maxVisiblePages - 1;
    return [
      { label: "1", value: 1 },
      { label: "...", value: -1 },
      ...addRange(totalPages - pagesAtEnd + 1, totalPages),
    ];
  }, [currentPage, totalPages, maxVisiblePages]);

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
            <Select
              id={props.id ? `${props.id}-select` : undefined}
              size="sm"
              value={currentItems.toString()}
              onSelect={handleRowsPerPageChange}
              disabled={disabled}
              items={rowsPerPageOptions.map((option) => ({
                id: `pagination-option-${option}`,
                label: option.toString(),
              }))}
            />
          </>
        )}
      </div>
      <div className="flex items-center gap-xs h-full">
        {showRowsPerPageSelector && (
          <>
            <Body htmlVariant="p" size="sm" color="weak" weight="weak">
              {t("pagination.showingRange", {
                currentItemsRendered,
                totalItems,
              })}
            </Body>
            {totalPages > 1 && <Divider orientation="vertical" weight="thin" />}
          </>
        )}
        {totalPages > 1 && (
          <>
            <Button
              kind="icon-button"
              label={t("pagination.firstPage")}
              icon="chevron-left-double"
              intent="flat"
              color="default"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || disabled}
            />
            <Button
              kind="icon-button"
              label={t("pagination.previousPage")}
              icon="chevron-left"
              intent="flat"
              color="default"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
            />
            <div className="flex gap-2xs">
              {pages.map(({ label, value }, idx) => {
                if (label === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex w-element-sm justify-center items-center shrink-0 text-onsurface-weak text-body-sm font-weak leading-xs"
                    >
                      ...
                    </span>
                  );
                }
                const isShortened = /^\.\.\d{2}$/.test(label);
                const buttonContent = (
                  <span className="flex w-element-sm justify-center items-center shrink-0 text-onsurface-default text-body-sm font-weak leading-xs">
                    {label}
                  </span>
                );
                return (
                  <button
                    className={button({
                      active: currentPage === value,
                      disabled,
                    })}
                    key={value}
                    aria-label={`Page ${value}`}
                    disabled={disabled}
                    onClick={() => handlePageChange(value)}
                  >
                    {isShortened ? (
                      <Tooltip label={value.toString()}>
                        {buttonContent}
                      </Tooltip>
                    ) : (
                      buttonContent
                    )}
                  </button>
                );
              })}
            </div>
            <Button
              kind="icon-button"
              label={t("pagination.nextPage")}
              icon="chevron-right"
              intent="flat"
              color="default"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
            />
            <Button
              kind="icon-button"
              label={t("pagination.lastPage")}
              icon="chevron-right-double"
              intent="flat"
              color="default"
              size="sm"
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
