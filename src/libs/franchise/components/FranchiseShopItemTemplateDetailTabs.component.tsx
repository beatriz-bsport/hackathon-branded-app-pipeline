import React, { useCallback } from 'react';

import {
  LinearProgress,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import Tabs from '@material-ui/core/Tabs';

import { useShopDetailTabsModalPrompt } from '#hocs/shop-modal-prompt.hoc';

import FranchiseShopItemTemplateDetailInventoryTab from './FranchiseShopItemTemplateDetailInventoryTab.component';
import PromptOnPageLeaveComponent from '#components/Prompt';

import type {
  ProvisionBulkCreate,
  ShopItem,
  TabListOption,
  ProvisionCreate,
  Provision,
  ShopItemTemplate,
} from '#libs/shop/types';
import type { OptionCallback } from '#state/types';
import type { SelectOption } from '#libs/types';

import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';

type Props = {
  isLoading?: boolean;
  isVariantListLoading?: boolean;
  isUpdatingVariant?: boolean;
  isDeletingVariant?: boolean;
  selectedTab: TabListOption;
  variantList: ShopItem[];
  shopItemTemplate: ShopItemTemplate;
  page: number;
  count: number;
  availableTabListOptions: TabListOption[];
  shopItemVariantFilterOptionList: {
    colors: SelectOption[];
    sizes: SelectOption[];
  };
  shopItemVariantFilterOptionValues: {
    colors: SelectOption[];
    sizes: SelectOption[];
  };
  variantCombinationListCount: number;
  setQueryParam: (queryParam: string) => (value: string) => void;
  handleOpenVariantDrawer: () => void;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  createShopItemProvisionBulk: (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes',
  ) => (options: SelectOption[]) => void;
};

const FranchiseShopItemTemplateDetailTabs: React.FC<Props> = ({
  isLoading,
  isVariantListLoading,
  isUpdatingVariant,
  isDeletingVariant,
  selectedTab,
  variantList,
  shopItemTemplate,
  page,
  count,
  availableTabListOptions = [],
  shopItemVariantFilterOptionList,
  shopItemVariantFilterOptionValues,
  variantCombinationListCount,
  setQueryParam,
  handleOpenVariantDrawer,
  createShopItemProvision,
  createShopItemProvisionBulk,
  changeInventoryVariantFilter,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const {
    isInventoryFormDirty,
    isVariantFormDirty,
    modalTitle,
    modalDescription,
    leaveWithoutSavingText,
    leaveWithSavingText,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,
  } = useShopDetailTabsModalPrompt();

  const onChangeTab = useCallback(
    (_: React.ChangeEvent, value: ShopItemDetailTab) => {
      setQueryParam('tab')(value);
    },
    [setQueryParam],
  );

  return (
    <Card>
      <TabContext value={selectedTab.value}>
        <PromptOnPageLeaveComponent
          forceCloseOnLeave
          openPromptOnPageLeave
          description={modalDescription}
          isDataClean={!isInventoryFormDirty && !isVariantFormDirty}
          leaveWithoutSavingText={leaveWithoutSavingText}
          leaveWithSavingText={leaveWithSavingText}
          onLeaveWithoutSaving={handleLeaveWithoutSaving}
          onLeaveWithSaving={handleSaveAndLeave}
          title={modalTitle}
        />

        {!isMobile && (
          <Tabs
            classes={{ root: classes.tabsContainer }}
            onChange={onChangeTab}
            selectionFollowsFocus={false}
            value={selectedTab.value}
          >
            {availableTabListOptions.map((option) => (
              <Tab
                key={option.value}
                className={classes.tab}
                label={option.label}
                value={option.value}
              />
            ))}
          </Tabs>
        )}

        {(isLoading || isVariantListLoading || isDeletingVariant) && (
          <LinearProgress color="primary" />
        )}

        {!isLoading && (
          <>
            <FranchiseShopItemTemplateDetailInventoryTab
              changeInventoryVariantFilter={changeInventoryVariantFilter}
              count={count}
              createShopItemProvision={createShopItemProvision}
              createShopItemProvisionBulk={createShopItemProvisionBulk}
              handleOpenVariantDrawer={handleOpenVariantDrawer}
              isStandaloneItem={shopItemTemplate?.is_standalone_item}
              isUpdatingVariant={isUpdatingVariant}
              page={page}
              setQueryParam={setQueryParam}
              shopItemTemplate={shopItemTemplate}
              shopItemVariantFilterOptionList={shopItemVariantFilterOptionList}
              shopItemVariantFilterOptionValues={
                shopItemVariantFilterOptionValues
              }
              shopItemVariantList={variantList}
              variantCombinationListCount={variantCombinationListCount}
            />
          </>
        )}
      </TabContext>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  shopItemCard: {
    marginBottom: theme.spacing(3),
  },
  shopItemCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  shopItemContentContainer: {
    display: 'flex',
  },
  shopItemCover: {
    width: 150,
  },
  shopItemText: {
    flex: 1,
    paddingLeft: theme.spacing(2),
  },
  tabsContainer: {
    backgroundColor: theme.palette.background.default,
  },
  tab: {
    '&:focus, &:hover': {
      color: 'inherit',
    },
  },
  tableContainer: {
    paddingBottom: theme.spacing(2),
  },
  tableEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  tablePagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

export default React.memo(FranchiseShopItemTemplateDetailTabs);
