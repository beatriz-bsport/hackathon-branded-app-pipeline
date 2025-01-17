import React from 'react';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import type { SearchObjectType } from '#src/libs/fuzzy-search/types';

export type WithObjectSearch = ReturnType<typeof useObjectSearch>;

/**
 * HOC to provide backend-fuzzy search results to a component.
 * This HOC should only be used with class components, when using a function
 * component please use directly "useObjectSearch" hook.
 * @argument Component - The component that will receive the search results
 * @argument searchedObjectTypes (optional) - The types of objects that will be searched. This is used to limit
 * the objects watched for change. If not provided, the component will re-render on any search result change.
 */

export const withObjectSearch = <T extends {}>(
  Component: React.ComponentType<T>,
  searchedObjectTypes?: SearchObjectType[],
) => {
  return React.memo((props: React.PropsWithChildren<T>) => {
    const injectedProps = useObjectSearch(searchedObjectTypes);

    return <Component {...injectedProps} {...props} />;
  });
};
