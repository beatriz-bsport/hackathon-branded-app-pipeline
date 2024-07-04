import React from 'react';
import classNames from 'classnames';

import Skeleton from '#src/components/css-only/Skeleton';

import './styles.css';

type Props = {
  classes?: {
    root?: string;
    title?: string;
    tabs?: string;
    tab?: string;
    'filter-tabs'?: string;
    'filter-tab'?: string;
  };
};

const PageHeaderSkeleton: React.FC<Props> = ({ classes }) => {
  const rootClassName = classNames(
    'bs-consumer-header-skeleton__root',
    classes?.root ?? '',
  );

  const titleClassName = classNames(
    'bs-consumer-header-skeleton__title',
    classes?.title ?? '',
  );

  const tabsClassName = classNames(
    'bs-consumer-header-skeleton__tabs',
    classes?.tabs ?? '',
  );

  const tabClassName = classNames(
    'bs-consumer-header-skeleton__tabs__tab',
    classes?.tab ?? '',
  );

  const filterTabsClassName = classNames(
    'bs-consumer-header-skeleton__filter-tabs',
    classes?.['filter-tabs'] ?? '',
  );

  const filterTabClassName = classNames(
    'bs-consumer-header-skeleton__filter-tabs__tab',
    classes?.['filter-tab'] ?? '',
  );

  return (
    <div className={rootClassName}>
      <Skeleton className={titleClassName} />
      <div className={tabsClassName}>
        <Skeleton className={tabClassName} />
        <Skeleton className={tabClassName} />
        <Skeleton className={tabClassName} />
        <Skeleton className={tabClassName} />
      </div>
      <div className={filterTabsClassName}>
        <Skeleton className={filterTabClassName} />
        <Skeleton className={filterTabClassName} />
      </div>
    </div>
  );
};

export default React.memo(PageHeaderSkeleton);
