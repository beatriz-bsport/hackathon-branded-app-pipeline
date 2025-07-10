import EmptyState, {
  type EmptyStateProps,
} from "#src/components/private/EmptyState";

export type UseEmptyStateProps = {
  isEmpty?: boolean;
  emptyConfig?: Omit<EmptyStateProps, "variant">;
  isEmptySearch?: boolean;
  emptySearchConfig?: Omit<EmptyStateProps, "variant">;
};

/**
 * Given an empty configuration (basic empty state, and empty search), returns
 * the right EmptyState component (`EmptyState`),
 * and whether it should be rendered (`shouldRenderEmptyState`).
 * @param emptyConfig Props for the EmptyState component in classic empty state.
 * @param emptySearchConfig Props for the EmptyState component when it is empty due to filtering.
 * @param isEmpty Whether the list of items is empty.
 * @param isSearchEmpty Whether the list of items is empty due to filtering. Takes precedence over isEmpty.
 */
const useEmptyState = (props?: UseEmptyStateProps) => {
  // Init with default values
  const { isEmpty, isEmptySearch, emptyConfig, emptySearchConfig } = props || {
    isEmpty: false,
    isEmptySearch: false,
    emptyConfig: {},
    emptySearchConfig: {},
  };
  const hasEmptyConfigured = isEmpty && !!emptyConfig;
  const hasEmptySearchConfigured = isEmptySearch && !!emptySearchConfig;
  return {
    shouldRenderEmptyState: hasEmptySearchConfigured || hasEmptyConfigured,
    EmptyState: () => (
      <div className="flex flex-row w-full justify-center items-center h-full">
        <EmptyState
          variant={
            hasEmptySearchConfigured ? "no-results-found" : "empty-state"
          }
          {...(hasEmptySearchConfigured ? emptySearchConfig : emptyConfig)}
        />
      </div>
    ),
  };
};

export default useEmptyState;
