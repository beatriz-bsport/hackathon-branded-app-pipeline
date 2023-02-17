type carouselParams = {
  isFirstItem: boolean;
  isPreviousItem: boolean;
  isCurrentItem: boolean;
  isNextItem: boolean;
  lastClickAction: string;
  previousItemIndex: number;
  itemIndex: number;
  nextItemIndex: number;
};

export const getCarouselItemClasses = (carouselParams: carouselParams) => {
  const {
    isFirstItem,
    isPreviousItem,
    isCurrentItem,
    isNextItem,
    lastClickAction,
    previousItemIndex,
    itemIndex,
    nextItemIndex,
  } = carouselParams;

  const itemClasses = ['bs-carousel__item'];

  if (isPreviousItem) itemClasses.push('bs-carousel__item__left');
  if (isCurrentItem && itemIndex === 0)
    itemClasses.push('bs-carousel__ml_auto');
  if (isCurrentItem) itemClasses.push('bs-carousel__item__center');
  if (isNextItem) itemClasses.push('bs-carousel__item__right');
  if (isFirstItem) itemClasses.push('bs-carousel__item__first');
  if (itemIndex === previousItemIndex - 1) itemClasses.push('hidden-item-left');
  if (itemIndex === nextItemIndex + 1) itemClasses.push('hidden-item-right');
  if (itemIndex === previousItemIndex - 1 && lastClickAction === 'right') {
    itemClasses.push('fade-away-left');
  }
  if (itemIndex === nextItemIndex + 1 && lastClickAction === 'left') {
    itemClasses.push('fade-away-right');
  }

  switch (lastClickAction) {
    case 'left':
      if (isPreviousItem) itemClasses.push('right-to-zero-first');
      if (isCurrentItem) itemClasses.push('right-to-zero');
      if (isNextItem) itemClasses.push('right-to-zero-last');
      break;
    case 'right':
      if (isPreviousItem) itemClasses.push('left-to-zero-first');
      if (isCurrentItem) itemClasses.push('left-to-zero');
      if (isNextItem) itemClasses.push('left-to-zero-last');
      break;
    default:
  }

  return itemClasses;
};
