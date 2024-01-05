import React, { JSX } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './styles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

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

const RenderInfiniteScrollItem: React.FC<{ item: string; index: number }> = ({
  item,
  index,
}) => {
  return <div>{`${item}-${index}`}</div>;
};

const ScrollContainerCssOnly: React.FC<{
  containerId?: string;
}> = ({ containerId, children }) => {
  if (!containerId) {
    return <>{children}</>;
  }
  return (
    <div
      className="scroll-component__nested-div scroll-component"
      id={containerId}
    >
      {children}
    </div>
  );
};

const GenericInfiniteScrollCssOnly: React.FC<GenericInfiniteScrollProps> = ({
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
    <ScrollContainerCssOnly
      containerId={useScrollableTarget && 'scrollableDiv'}
    >
      <GenericInfiniteScrollEnhancedCssOnly<string>
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
    </ScrollContainerCssOnly>
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

export const GenericInfiniteScrollEnhancedCssOnly = <T extends unknown>({
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
  const infiniteScrollStyle = React.useMemo(() => {
    if (scrollableTarget) {
      return { overflow: 'hidden' };
    }
    return {};
  }, [scrollableTarget]);

  return (
    <InfiniteScroll
      className="scroll-component"
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
        <div
          key={`${index}-${item}`}
          className="scroll-component__specific-item-style"
        >
          {renderItem({ item, index })}
        </div>
      ))}
    </InfiniteScroll>
  );
};

export const GenericInfiniteScrollCssOnlyForStoryBook = marketplaceCssHoc()(
  GenericInfiniteScrollCssOnly,
);

export default React.memo(GenericInfiniteScrollCssOnly);
