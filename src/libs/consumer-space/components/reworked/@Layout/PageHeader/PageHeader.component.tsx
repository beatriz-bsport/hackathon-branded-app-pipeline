import React, { memo } from 'react';

import classNames from 'classnames';

import PageHeaderSkeleton from './PageHeaderSkeleton/PageHeaderSkeleton.component';

import PageHeaderTitle from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader/PageHeaderTitle';
import PageHeaderTabs from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader/PageHeaderTabs';
import PageHeaderFilters from '#src/libs/consumer-space/components/reworked/@Layout/PageHeaderFilters';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';
import type { PageHeaderTabsType, TabData } from './PageHeaderTabs/types';
import type { TabFilter } from '../PageHeaderFilters/types';
import './styles.css';

type Props = {
  classes?: {
    container?: string;
  };
  isLoading?: boolean;
  isMobile: boolean;
  TitleProps?: {
    buttons: HeaderButton[];
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
};

const PageHeader: React.FC<Props> = ({
  classes,
  isLoading,
  isMobile,
  TabsProps,
  TitleProps,
  FilterProps,
}) => {
  if (isLoading) {
    return (
      <PageHeaderSkeleton classes={{ root: 'bs-consumer-pass-page__header' }} />
    );
  }
  return (
    <div
      className={classNames(
        'bs-consumer-page__header',
        classes?.container ?? '',
      )}
    >
      <PageHeaderTitle
        buttonsData={TitleProps?.buttons ?? []}
        isMobile={!!isMobile}
        title={TitleProps.title}
      />
      <PageHeaderTabs
        handleToggleTabDrawer={TabsProps?.handleToggleTabDrawer}
        isMobile={isMobile}
        selectedTab={TabsProps?.selectedTab}
        tabs={TabsProps?.tabs ?? []}
      />
      <PageHeaderFilters
        filters={FilterProps?.filters ?? []}
        selectedFilter={FilterProps?.selectedFilter}
      />
    </div>
  );
};

export default memo(PageHeader);
