import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TabPanel from '@material-ui/lab/TabPanel';

import AddIcon from '@material-ui/icons/Add';

import { OptionProps } from 'react-select/lib/components/Option';
import FranchiseSubshopTemplateList from '#libs/franchise/components/FranchiseSubshopTemplateList';
import FranchiseSubshopTemplateDialog from '#libs/franchise/components/FranchiseSubshopTemplateDialog';
import ObjectSearch from '#libs/fuzzy-search/components/ObjectSearch.component';
import FranchiseShopItemTemplateListItem from '#libs/franchise/components/FranchiseShopItemTemplateListItem';

import type { ShopItemTemplate, SubshopTemplate } from '#libs/shop/types';
import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type { OptionCallback, PaginatedResponse } from '#state/types';
import type { ErrorAndLoading, SelectOption } from '#libs/types';

import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';
import { FranchiseSubshopTemplateDialogEnum } from '#libs/franchise/components/FranchiseSubshopTemplateDialog/constants';

type Props = {
  subshopTemplateList: SubshopTemplate[];
  goToShopItemTemplate: (shopItemTemplateId: number) => void;
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
  handleOpenShopItemTemplateForm: (subshopTemplateId: number) => void;
  handleSetShopItemTemplateToDelete: (
    shopItemTemplate: ShopItemTemplate,
    subshopTemplateId: number,
  ) => void;
};

const FranchiseShopListProductsTabSearchListItem = React.memo(
  (
    props: OptionProps<SelectOption<number>> &
      Pick<Props, 'goToShopItemTemplate'>,
  ) => (
    <FranchiseShopItemTemplateListItem
      goToShopItemTemplate={props.goToShopItemTemplate}
      shopItemTemplate={props.data.item}
    />
  ),
);

const FranchiseShopListProductsTab: React.FC<Props> = ({
  subshopTemplateList,
  goToShopItemTemplate,
  getShopItemTemplateState,
  createSubshopTemplate,
  updateSubshopTemplate,
  deleteSubshopTemplate,
  fetchShopItemTemplateList,
  handleOpenShopItemTemplateForm,
  handleSetShopItemTemplateToDelete,
}) => {
  const { t } = useTranslation(['shop', 'common']);

  const [selectedSubshopTemplate, setSelectedSubshopTemplate] =
    useState<SubshopTemplate | null>(null);

  const [showFranchiseSubshopDialog, setShowFranchiseSubshopDialog] =
    useState(false);

  // used to know the context of the dialog being displayed
  const [
    franchiseSubshopTemplateDialogType,
    setFranchiseSubshopTemplateDialogType,
  ] = useState<FranchiseSubshopTemplateDialogEnum | null>(null);

  const classes = useStyles();

  const handleSetSelectedSubshopTemplate = useCallback(
    (subshopTemplate: SubshopTemplate) =>
      setSelectedSubshopTemplate(subshopTemplate),
    [],
  );

  const handleSetFranchiseSubshopDialogType = useCallback(
    (type: FranchiseSubshopTemplateDialogEnum) =>
      setFranchiseSubshopTemplateDialogType(type),
    [],
  );

  const handleHideFranchiseSubshopDialog = useCallback(
    () => setShowFranchiseSubshopDialog(false),
    [],
  );

  /**
   * Handler whenever a user click on a subshop template menu action for create/update/delete
   * @param dialogType The type to set used for the dialog content
   * @param subshopTemplate The optional initial subshop template to set in formik
   * @param extraActions An optional function fired just after opening the dialog
   */
  const handleOpenSubshopTemplateDialog = useCallback(
    (
      dialogType: FranchiseSubshopTemplateDialogEnum,
      subshopTemplate?: SubshopTemplate,
      extraActions?: () => void,
    ) => {
      handleSetFranchiseSubshopDialogType(null);
      handleSetSelectedSubshopTemplate(subshopTemplate ?? null);
      handleSetFranchiseSubshopDialogType(dialogType);
      setShowFranchiseSubshopDialog(true);
      extraActions?.();
    },
    [handleSetFranchiseSubshopDialogType, handleSetSelectedSubshopTemplate],
  );

  const handleSubshopTemplateSubmit = useCallback(
    (values: ShopListSubshopFormValues) => {
      switch (franchiseSubshopTemplateDialogType) {
        case FranchiseSubshopTemplateDialogEnum.CREATE:
          createSubshopTemplate(values, {
            onSuccess: handleHideFranchiseSubshopDialog,
          });
          break;
        case FranchiseSubshopTemplateDialogEnum.UPDATE:
          values.id &&
            updateSubshopTemplate(values, {
              onSuccess: handleHideFranchiseSubshopDialog,
            });
          break;
        case FranchiseSubshopTemplateDialogEnum.DELETE:
          deleteSubshopTemplate(values.id, {
            onSuccess: handleHideFranchiseSubshopDialog,
          });
          break;
        default:
      }
    },
    [
      franchiseSubshopTemplateDialogType,
      createSubshopTemplate,
      handleHideFranchiseSubshopDialog,
      updateSubshopTemplate,
      deleteSubshopTemplate,
    ],
  );

  const handleCreateSubshopTemplateClick = useCallback(
    () =>
      handleOpenSubshopTemplateDialog(
        FranchiseSubshopTemplateDialogEnum.CREATE,
      ),
    [handleOpenSubshopTemplateDialog],
  );

  const objectSearchOptionsFormatter = useCallback(
    (results) =>
      results.map((shopItemTemplate: ShopItemTemplate) => ({
        label: shopItemTemplate.name,
        value: shopItemTemplate.id,
        item: shopItemTemplate,
      })),
    [],
  );

  return (
    <TabPanel className={classes.contentContainer} value={ShopListTab.PRODUCTS}>
      <div className={classes.searchContainer}>
        <ObjectSearch
          additionalParams={{ is_variant: false }}
          className={classes.searchInput}
          components={{
            Option: (props) => (
              <FranchiseShopListProductsTabSearchListItem
                {...props}
                goToShopItemTemplate={goToShopItemTemplate}
              />
            ),
          }}
          optionsFormatter={objectSearchOptionsFormatter}
          placeholder={t('shop:search')}
          searchedObjectType="shop_item_template"
          styles={objectSearchStyles}
        />
        <Button
          color="primary"
          onClick={handleCreateSubshopTemplateClick}
          startIcon={<AddIcon color="primary" />}
          variant="outlined"
        >
          {t('shop:shopList.tab.products.subshopForm.title')}
        </Button>
      </div>

      <FranchiseSubshopTemplateList
        fetchShopItemTemplateList={fetchShopItemTemplateList}
        getShopItemTemplateState={getShopItemTemplateState}
        goToShopItemTemplate={goToShopItemTemplate}
        handleOpenShopItemTemplateForm={handleOpenShopItemTemplateForm}
        handleOpenSubshopTemplateDialog={handleOpenSubshopTemplateDialog}
        handleSetShopItemTemplateToDelete={handleSetShopItemTemplateToDelete}
        subshopTemplateList={subshopTemplateList}
      />

      <FranchiseSubshopTemplateDialog
        dialogType={franchiseSubshopTemplateDialogType}
        handleClose={handleHideFranchiseSubshopDialog}
        handleSubmit={handleSubshopTemplateSubmit}
        isOpen={
          showFranchiseSubshopDialog && !!franchiseSubshopTemplateDialogType
        }
        selectedSubshopTemplate={selectedSubshopTemplate}
      />
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  searchContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  searchInput: {
    flex: 1,
  },
  fuzeSearchContainer: { flex: 1 },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: 0,
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: 0,
    borderBottom: 0,
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
}));

const objectSearchStyles = (() => ({
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  control: (provided: React.CSSProperties) => ({
    ...provided,
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #000',
    boxShadow: 'none',
    borderRadius: 0,
    ':hover': {
      borderBottom: '2px solid #000',
    },
  }),
}))();

export default React.memo(FranchiseShopListProductsTab);
