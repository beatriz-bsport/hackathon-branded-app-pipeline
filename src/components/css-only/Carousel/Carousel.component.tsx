import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useMediaQuery, useTheme } from '@material-ui/core';

import { useSwipe } from '../../../hooks/useSwipe';
import { useWheel } from '../../../hooks/useWheel';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { SLIDESHOW_INTERVAL_TIME, SLIDESHOW_ANIMATION_TIME } from './constants';
import { getCarouselItemClasses } from '#csscomponents/utils';
import './style.css';
import CarouselIndicator from './CarouselIndicator';

export interface Props<T = unknown> {
  data: Array<T>;
  renderItem: (item: T, index: number) => React.ReactElement;
}

export interface BaseData {
  id: number;
}

const Carousel = <T extends BaseData>(props: Props<T>) => {
  const { data, renderItem } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastClickAction, setlastClickAction] = useState(null);
  const [isTransition, setIsTransition] = useState(false);
  const [isAutomaticSlideshow, setIsAutomaticSlideshow] = useState(true);
  const carouselSwipeContainer = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const nextItemIndex = currentIndex + 1;
  const previousItemIndex = currentIndex - 1;
  const lastItemIndex = data.length - 1;

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
    onSwipeLeft: useCallback(
      () => handleNagivate(nextItemIndex),
      [handleNagivate, nextItemIndex],
    ),
    onSwipeRight: useCallback(
      () => handleNagivate(previousItemIndex),
      [handleNagivate, previousItemIndex],
    ),
  });

  useWheel({
    ref: carouselSwipeContainer,
    onScrollDown: () => !isTransition && handleNagivate(nextItemIndex),
    onScrollUp: () => !isTransition && handleNagivate(previousItemIndex),
  });

  useEffect(() => {
    const isLastIndex = currentIndex === lastItemIndex;
    const slideshowInterval = setInterval(
      () =>
        isAutomaticSlideshow &&
        handleNagivate(isLastIndex ? 0 : currentIndex + 1),
      SLIDESHOW_INTERVAL_TIME,
    );

    return () => clearInterval(slideshowInterval);
  }, [
    currentIndex,
    isAutomaticSlideshow,
    data.length,
    lastItemIndex,
    handleNagivate,
  ]);

  const translateCount = useMemo(() => {
    let translateDistanceViewportUnit = 0;
    const translateDistanceGap = 8 * currentIndex;
    const carouselItemWidth = 50;
    const translateDistanceItem = 20;

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

    return `translateX(calc(${translateDistanceViewportUnit}vw - ${translateDistanceGap}px))`;
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
        type="button"
        className={`bs-carousel__navigation__button${isLeftNavigationButtonHiddenClass}`}
        onClick={() => handleNagivate(previousItemIndex)}
      >
        <ChevronLeftIcon />
      </button>

      <div
        className="bs-carousel__items__indicator__container"
        onMouseEnter={() => !isMobile && setIsAutomaticSlideshow(false)}
        onPointerEnter={() => isMobile && setIsAutomaticSlideshow(false)}
        onMouseLeave={() => !isMobile && setIsAutomaticSlideshow(true)}
        onPointerLeave={() => isMobile && setIsAutomaticSlideshow(true)}
      >
        <div
          className="bs-carousel__items__container"
          ref={carouselSwipeContainer}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
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
          data={data}
          currentIndex={currentIndex}
          onClick={(newIndex: number) => !isMobile && setCurrentIndex(newIndex)}
        />
      </div>

      <button
        type="button"
        className={`bs-carousel__navigation__button${isRightNavigationButtonHiddenClass}`}
        onClick={() => handleNagivate(nextItemIndex)}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default marketplaceCssHoc()(Carousel);
