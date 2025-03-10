import React, { memo } from 'react';

import clsx from 'clsx';

import PageHeaderTitle from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader/PageHeaderTitle';
import PageHeaderTabs from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader/PageHeaderTabs';
import PageHeaderFilters from '#src/libs/consumer-space/components/reworked/@Layout/PageHeaderFilters';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';
import type { PageHeaderTabsType, TabData } from './PageHeaderTabs/types';
import type { TabFilter } from '../PageHeaderFilters/types';
import Skeleton from '#src/components/css-only/Skeleton';
import './styles.css';

type Props = {
  classes?: {
    container?: string;
  };

  isMobile: boolean;
  TitleProps?: {
    buttons?: HeaderButton[];
    title: string;
  };
  TabsProps?: {
    selectedTab: keyof PageHeaderTabsType;
    tabs: TabData<PageHeaderTabsType>[];
    handleToggleTabDrawer?: () => void;
  };
  FilterProps?: {
    filters: TabFilter[];
    selectedFilter: string;
  };
  isFirstLoading?: boolean;
};

const PageHeader: React.FC<Props> = ({
  classes,
  isMobile,
  TabsProps,
  TitleProps,
  FilterProps,
  isFirstLoading,
}) => {
  return (
    <div className={clsx('bs-consumer-page__header', classes?.container ?? '')}>
      <PageHeaderTitle
        buttonsData={TitleProps?.buttons ?? []}
        isMobile={!!isMobile}
        title={TitleProps.title}
      />
      {isFirstLoading ? (
        <Skeleton
          className="bs-consumer-page__header__tab-skeleton"
          variant="rectangle"
        />
      ) : (
        <PageHeaderTabs
          handleToggleTabDrawer={TabsProps?.handleToggleTabDrawer}
          isMobile={isMobile}
          selectedTab={TabsProps?.selectedTab}
          tabs={TabsProps?.tabs ?? []}
        />
      )}
      {isFirstLoading ? (
        <Skeleton
          className="bs-consumer-page__header__tab-skeleton"
          variant="rectangle"
        />
      ) : (
        <PageHeaderFilters
          filters={FilterProps?.filters ?? []}
          selectedFilter={FilterProps?.selectedFilter}
        />
      )}
    </div>
  );
};

export default memo(PageHeader);
