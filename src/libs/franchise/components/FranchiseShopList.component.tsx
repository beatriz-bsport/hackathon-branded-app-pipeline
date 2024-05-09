import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import FranchiseShopListTabs from './FranchiseShopListTabs.component';

import type { ShopItemTemplate, SubshopTemplate } from '#src/libs/shop/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type { ErrorAndLoading } from '#src/libs/types';

type Props = {
  isLoading?: boolean;
  subshopTemplateList: SubshopTemplate[];
  getShopItemTemplateState: (
    subshopTemplateId: number,
  ) => ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
  createSubshopTemplate: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => void;
  updateSubshopTemplate: (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => void;
  deleteSubshopTemplate: (id: number, options?: OptionCallback<number>) => void;
  fetchShopItemTemplateList: (
    subshopTemplateId: number,
    page?: number,
    options?: OptionCallback<PaginatedResponse<ShopItemTemplate>>,
  ) => void;
};

const FranchiseShopList: React.FC<Props> = ({
  isLoading,
  subshopTemplateList,
  getShopItemTemplateState,
  createSubshopTemplate,
  updateSubshopTemplate,
  deleteSubshopTemplate,
  fetchShopItemTemplateList,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {isLoading && <LinearProgress />}
      <FranchiseShopListTabs
        createSubshopTemplate={createSubshopTemplate}
        deleteSubshopTemplate={deleteSubshopTemplate}
        fetchShopItemTemplateList={fetchShopItemTemplateList}
        getShopItemTemplateState={getShopItemTemplateState}
        subshopTemplateList={subshopTemplateList}
        updateSubshopTemplate={updateSubshopTemplate}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
}));

export default React.memo(FranchiseShopList);
