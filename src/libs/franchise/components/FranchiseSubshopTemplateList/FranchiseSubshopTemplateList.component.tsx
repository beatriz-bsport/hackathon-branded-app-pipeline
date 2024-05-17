import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import FranchiseShopItemTemplateListItem from '#libs/franchise/components/FranchiseShopItemTemplateListItem';
import FranchiseShopItemTemplateListItemSkeleton from '#libs/franchise/components/FranchiseShopItemTemplateListItem/FranchiseShopItemTemplateListItemSkeleton.component';

import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopItemTemplate, SubshopTemplate } from '#src/libs/shop/types';
import type { ErrorAndLoading } from '#src/libs/types';

import { FranchiseSubshopTemplateDialogEnum } from '#src/libs/franchise/components/FranchiseSubshopTemplateDialog/constants';
import { SHOP_ITEM_TEMPLATE_PAGE_SIZE } from '#src/libs/shop/constants';

type Props = {
  subshopTemplateList: SubshopTemplate[];
  getShopItemTemplateState: (
    subshopTemplateId: number,
  ) => ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
  fetchShopItemTemplateList: (
    subshopTemplateId: number,
    page?: number,
    options?: OptionCallback<PaginatedResponse<ShopItemTemplate>>,
  ) => void;
  handleOpenSubshopTemplateDialog: (
    type: FranchiseSubshopTemplateDialogEnum,
    subshopTemplate?: SubshopTemplate,
    extraActions?: () => void,
  ) => void;
  handleOpenShopItemTemplateForm: (subshopTemplateId: number) => void;
  handleSetShopItemTemplateToDelete: (
    shopItemTemplate: ShopItemTemplate,
    subshopTemplateId: number,
  ) => void;
};

type FranchiseSubshopTemplateListItemProps = Omit<
  Props,
  'subshopTemplateList' | 'getShopItemTemplateState'
> & {
  subshopTemplate: SubshopTemplate;
  shopItemTemplateState: ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
};

const FranchiseSubshopTemplateListItem: React.FC<FranchiseSubshopTemplateListItemProps> =
  React.memo(
    ({
      subshopTemplate,
      shopItemTemplateState,
      handleOpenSubshopTemplateDialog,
      fetchShopItemTemplateList,
      handleOpenShopItemTemplateForm,
      handleSetShopItemTemplateToDelete,
    }) => {
      const { t } = useTranslation(['common', 'shop']);

      const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

      const [isExpanded, setIsExpanded] = useState(false);

      const classes = useStyles({ isExpanded });

      const handleToggleExpand = useCallback(() => {
        if (!isExpanded && !shopItemTemplateState) {
          fetchShopItemTemplateList(subshopTemplate.id);
        }
        setIsExpanded((state) => !state);
      }, [
        fetchShopItemTemplateList,
        isExpanded,
        shopItemTemplateState,
        subshopTemplate.id,
      ]);

      const handleOpenSubshopTemplateActionsMenu = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
          const target = event.currentTarget;
          setAnchorEl(target);
        },
        [],
      );

      const handleCloseSubshopTemplateActionsMenu = useCallback(() => {
        setAnchorEl(null);
      }, []);

      const handleSelectSubshopTemplate = useCallback(
        (dialogType: FranchiseSubshopTemplateDialogEnum) => () => {
          handleOpenSubshopTemplateDialog(
            dialogType,
            subshopTemplate,
            handleCloseSubshopTemplateActionsMenu,
          );
        },
        [
          handleOpenSubshopTemplateDialog,
          subshopTemplate,
          handleCloseSubshopTemplateActionsMenu,
        ],
      );

      const handlePageChange = useCallback(
        (_: React.ChangeEvent, pageNumber: number) =>
          fetchShopItemTemplateList(subshopTemplate.id, pageNumber),
        [fetchShopItemTemplateList, subshopTemplate.id],
      );

      const handleAddShopItemTemplate = useCallback(
        () => handleOpenShopItemTemplateForm(subshopTemplate.id),
        [handleOpenShopItemTemplateForm, subshopTemplate.id],
      );

      const handleDeleteShopItemTemplate = useCallback(
        (shopItemTemplate: ShopItemTemplate) => () =>
          handleSetShopItemTemplateToDelete(
            shopItemTemplate,
            subshopTemplate.id,
          ),
        [handleSetShopItemTemplateToDelete, subshopTemplate.id],
      );

      const subshopTemplateCategoryTitle = (() => {
        let title = subshopTemplate.name;
        if (shopItemTemplateState?.count > 0) {
          title += ` (${shopItemTemplateState?.count})`;
        }
        return title;
      })();

      return (
        <div className={classes.subshopTemplateContainer}>
          <div className={classes.buttonTitle}>
            <Typography variant="h6">{subshopTemplateCategoryTitle}</Typography>

            <div>
              <IconButton onClick={handleOpenSubshopTemplateActionsMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                keepMounted
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                onClose={handleCloseSubshopTemplateActionsMenu}
                open={!!anchorEl}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem
                  className={classes.menuItem}
                  onClick={handleAddShopItemTemplate}
                >
                  <AddIcon className={classes.menuItemIcon} />
                  {t('shop:shopList.tab.products.addProduct')}
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  onClick={handleSelectSubshopTemplate(
                    FranchiseSubshopTemplateDialogEnum.UPDATE,
                  )}
                >
                  <EditIcon className={classes.menuItemIcon} />
                  {t('common:rename')}
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  onClick={handleSelectSubshopTemplate(
                    FranchiseSubshopTemplateDialogEnum.DELETE,
                  )}
                >
                  <DeleteIcon className={classes.menuItemIcon} />
                  {t('common:delete')}
                </MenuItem>
              </Menu>
              <IconButton onClick={handleToggleExpand}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
          </div>

          <Divider className={classes.divider} />

          <Collapse className={classes.collapse} in={isExpanded}>
            {shopItemTemplateState?.loading && (
              <List className={classes.shopItemTemplateList}>
                <FranchiseShopItemTemplateListItemSkeleton />
              </List>
            )}
            {!shopItemTemplateState?.loading &&
              (shopItemTemplateState?.results ?? []).map((shopItemTemplate) => (
                <List
                  key={shopItemTemplate.id}
                  className={classes.shopItemTemplateList}
                >
                  <FranchiseShopItemTemplateListItem
                    key={shopItemTemplate.id}
                    className={classes.shopItemTemplateListItem}
                    handleDelete={handleDeleteShopItemTemplate(
                      shopItemTemplate,
                    )}
                    shopItemTemplate={shopItemTemplate}
                  />
                </List>
              ))}
            {(shopItemTemplateState?.results ?? []).length === 0 &&
              !shopItemTemplateState?.loading && (
                <Typography align="center">
                  {t('shop:shopList.tab.products.emptySubshopList')}
                </Typography>
              )}

            {shopItemTemplateState?.count > SHOP_ITEM_TEMPLATE_PAGE_SIZE && (
              <Pagination
                className={classes.paginationContainer}
                count={Math.ceil(
                  (shopItemTemplateState?.count ?? 0) /
                    SHOP_ITEM_TEMPLATE_PAGE_SIZE,
                )}
                onChange={handlePageChange}
                page={shopItemTemplateState?.page ?? 1}
              />
            )}
          </Collapse>
        </div>
      );
    },
  );

const FranchiseSubshopTemplateList: React.FC<Props> = ({
  subshopTemplateList,
  getShopItemTemplateState,
  fetchShopItemTemplateList,
  handleOpenSubshopTemplateDialog,
  handleOpenShopItemTemplateForm,
  handleSetShopItemTemplateToDelete,
}) => {
  return (
    <>
      {(subshopTemplateList ?? []).map((subshopTemplate) => (
        <FranchiseSubshopTemplateListItem
          key={subshopTemplate.id}
          fetchShopItemTemplateList={fetchShopItemTemplateList}
          handleOpenShopItemTemplateForm={handleOpenShopItemTemplateForm}
          handleOpenSubshopTemplateDialog={handleOpenSubshopTemplateDialog}
          handleSetShopItemTemplateToDelete={handleSetShopItemTemplateToDelete}
          shopItemTemplateState={getShopItemTemplateState(subshopTemplate.id)}
          subshopTemplate={subshopTemplate}
        />
      ))}
    </>
  );
};

const useStyles = makeStyles<Theme, { isExpanded: boolean }>((theme) => ({
  subshopTemplateContainer: {
    marginBottom: ({ isExpanded }) => isExpanded && theme.spacing(3),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  buttonTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  shopItemTemplateList: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1) / 2,
    padding: 0,
  },
  shopItemTemplateListItem: {
    '&:not(:last-of-type)': {
      borderBottom: `solid ${theme.palette.grey[300]} 1px`,
    },
  },
  menuItem: {
    gap: theme.spacing(1.5),
  },
  menuItemIcon: {
    color: theme.palette.text.secondary,
  },
  collapse: {
    padding: 0,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(FranchiseSubshopTemplateList);
