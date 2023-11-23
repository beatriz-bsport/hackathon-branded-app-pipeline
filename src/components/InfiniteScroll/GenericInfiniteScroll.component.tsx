import React, { JSX } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

type GenericInfiniteScrollProps = {
  endMessage: React.ReactNode;
  loader: React.ReactNode;
  loadingTime: number;
  pagination: number;
  total: number;
  nextAction: () => void;
  height?: number;
  useScrollableTarget?: boolean;
  isPullDownToRefreshActive?: boolean;
  loadingRate?: number;
  pullDownToRefreshContent?: React.ReactNode;
  pullDownToRefreshSize?: number;
  releaseToRefreshContent?: React.ReactNode;
  refreshAction?: () => void;
};

/**
 *  @description Renders individual items in an infinite scroll component.
 *
 * This React functional component is designed to render items within an infinite scroll container.
 * It takes an 'item' and its 'index' as props and displays them in a simple div element with a label
 * combining the item and its index.
 *
 * @param {string} item - The item to be displayed.
 * @param {number} index - The index of the item in the list.
 *
 * @return {JSX.Element} A div element displaying the item and its index.
 */
const RenderInfiniteScrollItem: React.FC<{ item: string; index: number }> = ({
  item,
  index,
}) => {
  return <div>{`${item}-${index}`}</div>;
};

/**
 * @description A React functional component for creating a container for scroll element.
 *
 * This React functional component designed for creating scrollable containers. It can be used to
 * wrap child components or elements in a scrollable container. If a 'containerId' is provided, it
 * will render a div with the specified ID, and if not, it will render the children directly.
 *
 * @param {string | undefined} containerId - Optional. The ID for the container div.
 * @param {number} height - Optional. The height for the container div.
 * @param {ReactNode} children - The child elements to be placed inside the scroll container.
 *
 * @return {JSX.Element} A scrollable container div with children elements.
 */
const ScrollContainer: React.FC<{
  containerId?: string;
  height?: number;
}> = ({ containerId, height, children }) => {
  const classes = useStyles({ height });
  if (!containerId) {
    return <>{children}</>;
  }
  return (
    <div
      className={`${classes.nestedDiv} ${classes.scrollComponent}`}
      id={containerId}
    >
      {children}
    </div>
  );
};

/**
 * @description A React functional component for implementing infinite scrolling with various features.
 *
 * GenericParentInfiniteScrolling is a versatile React component designed for implementing infinite scrolling
 * behavior in web applications. It offers seamless data loading, pagination, and optional pull-to-refresh
 * functionality, making it a powerful tool for managing and displaying extensive datasets efficiently.
 *
 * @param {React.ReactNode} endMessage - Element to be displayed at the end of the content when all elements have been loaded.
 * @param {React.ReactNode} loader - Element to be displayed during the loading of additional elements, serving as a loading indicator.
 * @param {number} loadingTime - Duration in seconds during which the loading of additional elements is simulated, controlling the speed at which new elements are added.
 * @param {number} pagination - Number of elements to load each time new elements are requested, contributing to content pagination.
 * @param {number} total - Total number of elements in the complete collection, for determining when all elements have been loaded.
 * @param {() => void} nextAction - Function called to request the loading of the next elements when the user reaches the end of the existing list.
 * @param {number} [height] - Optional numeric value that determines the height of the scrollable area. If not specified, it is automatically managed based on the content.
 * @param {boolean} [useScrollableTarget] - Optional boolean indicating whether a custom scroll target should be used. If true, a specific scroll target is used to trigger element loading on scroll.
 * @param {boolean} [isPullDownToRefreshActive] - Optional boolean that determines if the pull-down-to-refresh feature is active. If true, users can pull down to refresh the content.
 * @param {number} [loadingRate] - Optional numeric value that can be used to adjust the simulated loading speed when adding new elements.
 * @param {React.ReactNode} [pullDownToRefreshContent] - Optional element displayed when a user pulls down to refresh. It can contain a loading indicator or other visual elements.
 * @param {number} [pullDownToRefreshSize] - Optional numeric value that controls the size of the pull-down-to-refresh area, allowing customization of its appearance and sensitivity.
 * @param {React.ReactNode} [releaseToRefreshContent] - Optional element displayed when the user has pulled down and must now release to trigger the refresh.
 * @param {() => void} [refreshAction] - Optional function called when a user releases the pull-down-to-refresh area, allowing the triggering of a custom refresh action.
 *
 * @return {JSX.Element} A component that facilitates infinite scrolling within a scrollable container or not.
 */
const GenericInfiniteScroll: React.FC<GenericInfiniteScrollProps> = ({
  endMessage,
  loader,
  loadingTime,
  pagination,
  total,
  nextAction,
  height,
  useScrollableTarget,
  isPullDownToRefreshActive,
  loadingRate,
  pullDownToRefreshContent,
  pullDownToRefreshSize,
  releaseToRefreshContent,
  refreshAction,
}) => {
  const [items, setItems] = React.useState<string[]>(
    Array<string>(pagination).fill(''),
  );

  const [hasMore, setHasMore] = React.useState(true);

  const fetchMoreData = React.useCallback(() => {
    nextAction();
    if (items.length >= total) {
      setHasMore(false);
      return;
    }
    // Fake async API call which sends more records in 'loadingTime' seconds
    setTimeout(
      () => setItems(items.concat(Array<string>(pagination).fill(''))),
      loadingTime * 1000,
    );
  }, [items, loadingTime, nextAction, pagination, total]);

  const refreshData = React.useCallback(() => {
    refreshAction();
    // Fake async API call which loads one more record in 'loadingTime' seconds
    setTimeout(() => {
      setItems(['new'].concat(items));
    }, loadingTime * 1000);
  }, [items, loadingTime, refreshAction]);

  return (
    <ScrollContainer
      containerId={useScrollableTarget && 'scrollableDiv'}
      height={height}
    >
      <GenericEnhancedInfiniteScroll<string>
        endMessage={endMessage}
        fetchMoreData={fetchMoreData}
        hasMore={hasMore}
        height={height}
        isPullDownToRefreshActive={isPullDownToRefreshActive}
        items={items}
        loader={loader}
        loadingRate={loadingRate}
        pullDownToRefreshContent={pullDownToRefreshContent}
        pullDownToRefreshSize={pullDownToRefreshSize}
        refreshData={refreshData}
        releaseToRefreshContent={releaseToRefreshContent}
        renderItem={RenderInfiniteScrollItem}
        scrollableTarget={useScrollableTarget && 'scrollableDiv'}
      />
    </ScrollContainer>
  );
};

type BaseProps<T = unknown> = {
  hasMore: boolean;
  items: T[];
  endMessage: React.ReactNode;
  loader: React.ReactNode;
  isPullDownToRefreshActive?: boolean;
  scrollableTarget?: string;
  height?: number;
  loadingRate?: number;
  pullDownToRefreshSize?: number;
  pullDownToRefreshContent?: React.ReactNode;
  releaseToRefreshContent?: React.ReactNode;
  fetchMoreData: () => void;
  refreshData: () => void;
  renderItem: ({ item, index }: { item: T; index?: number }) => JSX.Element;
};

/**
 * @description Versatile React component for implementing infinite scrolling with various features.
 *
 * Flexible React component designed for implementing infinite scrolling behavior in web applications.
 * It efficiently manages data loading, pagination, and optional pull-to-refresh functionality, making it
 * a powerful tool for handling and displaying large datasets. This component offers a range of configuration
 * options to customize the behavior and appearance of the infinite scroll.
 *
 * @param {boolean} hasMore - Indicates whether there are more items to load.
 * @param {T[]} items - Array of items to be displayed in the infinite scroll.
 * @param {React.ReactNode} endMessage - Element to be displayed at the end when there are no more items to load.
 * @param {React.ReactNode} loader - Element to be displayed during the loading of additional items.
 * @param {boolean} [isPullDownToRefreshActive] - Optional flag that determines if pull-down-to-refresh functionality is active.
 * @param {string} [scrollableTarget] - Optional string specifying a custom scrollable target for the infinite scroll.
 * @param {number} [height] - Optional numeric value defining the height of the scrollable area.
 * @param {number} [loadingRate] - Optional numeric value controlling the scroll threshold for loading additional items.
 * @param {number} [pullDownToRefreshSize] - Optional numeric value defining the size of the pull-down-to-refresh area.
 * @param {React.ReactNode} [pullDownToRefreshContent] - Optional element displayed during pull-down-to-refresh.
 * @param {React.ReactNode} [releaseToRefreshContent] - Optional element displayed when the user must release to refresh.
 * @param {() => void} fetchMoreData - Function to trigger the loading of more items.
 * @param {() => void} refreshData - Function to trigger data refresh when using pull-down-to-refresh.
 * @param {({ item, index }: { item: T; index?: number }) => JSX.Element} renderItem - Function to render each item in the infinite scroll list.
 *
 * @return {JSX.Element} A component that facilitates infinite scrolling and data rendering.
 */
const GenericEnhancedInfiniteScroll = <T extends unknown>({
  hasMore,
  items,
  endMessage,
  loader,
  isPullDownToRefreshActive,
  scrollableTarget,
  height,
  loadingRate,
  pullDownToRefreshSize,
  pullDownToRefreshContent,
  releaseToRefreshContent,
  fetchMoreData,
  refreshData,
  renderItem,
}: BaseProps<T>) => {
  const classes = useStyles({ height });

  const infiniteScrollStyle = React.useMemo(() => {
    if (scrollableTarget) {
      return { overflow: 'hidden' };
    }
    return {};
  }, [scrollableTarget]);

  return (
    <InfiniteScroll
      className={classes.scrollComponent}
      dataLength={items.length}
      endMessage={endMessage}
      hasMore={hasMore}
      height={!!height && !scrollableTarget && height}
      loader={loader}
      next={fetchMoreData}
      pullDownToRefresh={isPullDownToRefreshActive}
      pullDownToRefreshContent={
        isPullDownToRefreshActive && pullDownToRefreshContent
      }
      pullDownToRefreshThreshold={
        isPullDownToRefreshActive && (pullDownToRefreshSize || 100)
      }
      refreshFunction={isPullDownToRefreshActive && refreshData}
      releaseToRefreshContent={
        isPullDownToRefreshActive && releaseToRefreshContent
      }
      scrollableTarget={!!scrollableTarget && scrollableTarget}
      scrollThreshold={loadingRate ? loadingRate / 100 : undefined}
      style={infiniteScrollStyle}
    >
      {items.map((item, index) => (
        <div key={`${index}-${item}`} className={classes.style}>
          {renderItem({ item, index })}
        </div>
      ))}
    </InfiniteScroll>
  );
};

const useStyles = makeStyles<Theme, Pick<BaseProps, 'height'>>((theme) => ({
  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.spacing(4),
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  nestedDiv: {
    height: ({ height }) => height || 400,
    border: '2px solid green',
    borderRadius: theme.spacing(1),
    overflow: 'auto',
  },
  scrollComponent: {
    '-ms-overflow-style': 'none' /* for Internet Explorer, Edge */,
    scrollbarWidth: 'none' /* for Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none' /* for Chrome, Safari, and Opera */,
    },
  },
}));

export default React.memo(GenericInfiniteScroll);
