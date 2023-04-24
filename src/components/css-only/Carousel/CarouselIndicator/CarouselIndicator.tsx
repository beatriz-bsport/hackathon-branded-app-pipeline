// @ts-nocheck
import React from 'react';
import { BaseData } from '../Carousel.component';

export interface Props<T = unknown> {
  data: Array<T>;
  currentIndex: number;
  onClick: (newIndex: number) => void;
}

const CarouselIndicator = <T extends BaseData>(props: Props<T>) => {
  const { data, currentIndex, onClick } = props;

  return (
    <div className="bs-carousel__indicator__container">
      {data.map((item: T, itemIndex: number) => {
        const isCurrentItem = itemIndex === currentIndex;
        const isItemOutOfRange =
          itemIndex === currentIndex - 2 || itemIndex === currentIndex + 2;
        const isItemInRange =
          itemIndex >= currentIndex - 2 && itemIndex <= currentIndex + 2;

        const selectedIndicatorClass = isCurrentItem
          ? ' bs-carousel__indicator__dot--selected'
          : '';
        const smallIndicatorDotClass = isItemOutOfRange
          ? ' bs-carousel__indicator__dot--more'
          : '';

        if (isItemInRange) {
          return (
            <button
              key={item.id}
              type="button"
              className={`bs-carousel__indicator__dot${selectedIndicatorClass}${smallIndicatorDotClass}`}
              onClick={() => onClick(itemIndex)}
            />
          );
        }

        return (
          <div
            key={item.id}
            className="bs-carousel__indicator__dot bs-carousel__indicator__dot--hidden"
          />
        );
      })}
    </div>
  );
};

export default CarouselIndicator;
