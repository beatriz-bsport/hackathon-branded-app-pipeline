import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { useSwipe } from '../../../hooks/useSwipe';
import { useWheel } from '../../../hooks/useWheel';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { SLIDESHOW_INTERVAL_TIME, SLIDESHOW_ANIMATION_TIME } from './constants';
import { getCarouselItemClasses } from '#csscomponents/utils';
import CarouselIndicator from './CarouselIndicator';

import './style.css';

export interface Props<T = unknown> {
  data: Array<T>;
  isSlideshowDisabled?: boolean;
  initialSelectedItemIndex?: number;
  renderItem: (item: T, index: number) => React.ReactElement;
  onSwipe?: (itemId: number | null) => void;
  onScroll?: (itemid: number | null) => void;
}

export interface BaseData {
  id: number;
}

const Carousel = <T extends BaseData>({
  data,
  isSlideshowDisabled,
  initialSelectedItemIndex,
  renderItem,
  onSwipe,
  onScroll,
}: Props<T>) => {
  const [currentIndex, setCurrentIndex] = useState<number>(null);
  const [lastClickAction, setlastClickAction] = useState(null);
  const [isTransition, setIsTransition] = useState(false);
  const [isAutomaticSlideshow, setIsAutomaticSlideshow] = useState(true);
  const carouselSwipeContainer = useRef<HTMLDivElement>(null);
  const navigationButtonLeft = useRef<HTMLButtonElement>(null);
  const navigationButtonRight = useRef<HTMLButtonElement>(null);

  // bs-carousel__navigation__button are hidden when container is less than 1100px
  const isMobile =
    navigationButtonLeft?.current &&
    window.getComputedStyle(navigationButtonLeft?.current)?.display ===
      'none' &&
    navigationButtonRight?.current &&
    window.getComputedStyle(navigationButtonRight?.current)?.display === 'none';

  const nextItemIndex = currentIndex + 1;
  const previousItemIndex = currentIndex - 1;
  const lastItemIndex = data.length - 1;
  const itemCount = data.length;

  const getAllInOneClasses = (itemIndex: number) => {
    const isPreviousItem = itemIndex === previousItemIndex;
    const isCurrentItem = itemIndex === currentIndex;
    const isNextItem = itemIndex === nextItemIndex;
    const isFirstItem = itemIndex === 0;

    const classes = getCarouselItemClasses({
      isPreviousItem,
      isCurrentItem,
      isNextItem,
      isFirstItem,
      lastClickAction,
      previousItemIndex,
      itemIndex,
      nextItemIndex,
      itemCount,
    });

    return classes.join(' ');
  };

  const handleNagivate = useCallback(
    (indexTo: number) => {
      if (!isTransition) {
        setIsTransition(true);
        setTimeout(() => setIsTransition(false), SLIDESHOW_ANIMATION_TIME);

        if (indexTo > currentIndex) {
          setlastClickAction('right');
        } else {
          setlastClickAction('left');
        }

        if (indexTo >= 0 && indexTo <= lastItemIndex) {
          setCurrentIndex(indexTo);
        }
      }
    },
    [currentIndex, lastItemIndex, isTransition],
  );

  const [onTouchStart, onTouchEnd] = useSwipe({
    onSwipeLeft: useCallback(() => {
      handleNagivate(nextItemIndex);
      data[nextItemIndex] && onSwipe && onSwipe(data[nextItemIndex].id ?? null);
    }, [data, handleNagivate, nextItemIndex, onSwipe]),
    onSwipeRight: useCallback(() => {
      handleNagivate(previousItemIndex);
      data[previousItemIndex] &&
        onSwipe &&
        onSwipe(data[previousItemIndex].id ?? null);
    }, [data, handleNagivate, onSwipe, previousItemIndex]),
  });

  useWheel({
    ref: carouselSwipeContainer,
    onScrollDown: () => {
      if (itemCount > 1 && !isTransition) {
        handleNagivate(nextItemIndex);
        onScroll && onScroll(data[nextItemIndex]?.id);
      }
    },
    onScrollUp: () => {
      if (itemCount > 1 && !isTransition) {
        handleNagivate(previousItemIndex);
        onScroll && onScroll(data[previousItemIndex]?.id);
      }
    },
  });

  useEffect(() => {
    const isLastIndex = currentIndex === lastItemIndex;
    const slideshowInterval = setInterval(() => {
      if (!isSlideshowDisabled) {
        isAutomaticSlideshow &&
          handleNagivate(isLastIndex ? 0 : currentIndex + 1);
      }
    }, SLIDESHOW_INTERVAL_TIME);

    if (currentIndex === null) {
      setCurrentIndex(initialSelectedItemIndex ?? 0);
    }

    return () => clearInterval(slideshowInterval);
  }, [
    currentIndex,
    isAutomaticSlideshow,
    lastItemIndex,
    isSlideshowDisabled,
    handleNagivate,
    initialSelectedItemIndex,
  ]);

  const translateCount = useMemo(() => {
    let translateDistanceViewportUnit = 0;
    const translateDistanceGap = 8 * currentIndex;
    const carouselItemWidth = 80;
    const translateDistanceItem = 10;

    switch (currentIndex) {
      case 0:
        translateDistanceViewportUnit = translateDistanceItem;
        break;
      default:
        translateDistanceViewportUnit = -(
          currentIndex * (carouselItemWidth - translateDistanceItem) +
          translateDistanceItem * previousItemIndex
        );
        break;
    }

    return `translateX(calc(${translateDistanceViewportUnit}cqw - ${translateDistanceGap}px))`;
  }, [currentIndex, previousItemIndex]);

  const isLeftNavigationButtonHiddenClass =
    currentIndex === 0 ? ' bs-carousel__navigation__button--hidden' : '';

  const isRightNavigationButtonHiddenClass =
    currentIndex === lastItemIndex
      ? ' bs-carousel__navigation__button--hidden'
      : '';

  return (
    <div className="bs-carousel__container">
      <button
        ref={navigationButtonLeft}
        className={`bs-carousel__navigation__button${isLeftNavigationButtonHiddenClass}`}
        onClick={() => handleNagivate(previousItemIndex)}
        type="button"
      >
        <ChevronLeftIcon />
      </button>

      <div
        className="bs-carousel__items__indicator__container"
        onMouseEnter={() => !isMobile && setIsAutomaticSlideshow(false)}
        onMouseLeave={() => !isMobile && setIsAutomaticSlideshow(true)}
        onPointerEnter={() => isMobile && setIsAutomaticSlideshow(false)}
        onPointerLeave={() => isMobile && setIsAutomaticSlideshow(true)}
      >
        <div
          ref={carouselSwipeContainer}
          className="bs-carousel__items__container"
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart}
        >
          <div
            className="bs-carousel__items__container__view"
            style={{
              transform: isMobile ? translateCount : 'inherit',
            }}
          >
            {data.map((item: T, itemIndex: number) => (
              <div key={item.id} className={getAllInOneClasses(itemIndex)}>
                {renderItem(item, itemIndex)}
              </div>
            ))}
          </div>
        </div>
        <CarouselIndicator
          currentIndex={currentIndex}
          data={data}
          onClick={(newIndex: number) => !isMobile && setCurrentIndex(newIndex)}
        />
      </div>

      <button
        ref={navigationButtonRight}
        className={`bs-carousel__navigation__button${isRightNavigationButtonHiddenClass}`}
        onClick={() => handleNagivate(nextItemIndex)}
        type="button"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

// @ts-expect-error
export const CarouselForStorybook = marketplaceCssHoc()(Carousel);

export default React.memo(Carousel);
