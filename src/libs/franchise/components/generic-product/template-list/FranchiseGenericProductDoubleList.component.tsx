// @ts-nocheck
import React from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { LinearProgress, Typography, Divider, Paper } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { OptionCallback } from '../../../../../state/types';
import FuzzySearch from '#components/search/FuzzySearch.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import FranchiseGenericProductListItem from './FranchiseGenericProductListItem.component';
import {
  FranchiseCompany,
  GenericProductTemplate,
} from '#libs/franchise/types';
import { sortCompanyListByIsAllowedAndName } from '#libs/franchise/utils';
import GenericDeleteDialog from '#components/genericDialog/GenericDeleteDialog.component';

export type Props = {
  // Both empty list => empty page
  loading: boolean;
  emptyExplainLabel: string;
  emptyButtonLabel: string;
  // Active and inactive list
  activeItemList: Array<GenericProductTemplate>;
  activeItemListLabel?: string;
  inactiveItemList: Array<GenericProductTemplate>;
  inactiveItemListLabel?: string;
  withFuzzySearch?: boolean;
  fuzzySearchPlaceholder?: string;
  fuzzySearchSearchFields?: Array<string>;
  fuzzySearchItemList?: Array<GenericProductTemplate>;
  // Delete template
  deleteTemplateDialogContent: string;
  deleteTemplateDialogTitle?: string;
  onDeleteTemplate: (id: number, options?: OptionCallback) => void;
  // Item
  getItemPrimaryText: (item?: GenericProductTemplate) => string;
  getItemSecondaryText: (item?: GenericProductTemplate) => string;
  getItemCover?: (item?: GenericProductTemplate) => string;
  getItemFranchiseCompanies: (
    item: GenericProductTemplate,
  ) => FranchiseCompany[];
  goToItemDetailPage: (id: number) => void;
  // To open forms in the parent
  onCreateTemplate: () => void;
  onUpdateTemplate: (templateId: number) => void;
};

export const FranchiseGenericProductDoubleList = (props: Props) => {
  const { t } = useTranslation('franchise');
  const { loading, getItemFranchiseCompanies } = props;
  const classes = useStyles();
  // eslint-disable-next-line
  const activeItemList = props.activeItemList || [];
  // eslint-disable-next-line
  const inactiveItemList = props.inactiveItemList || [];
  const displayEmptyText = !(
    loading ||
    !!activeItemList.length ||
    !!inactiveItemList.length
  );
  const [templateToDelete, setTemplateToDelete] = React.useState(null);
  const onDeleteTemplate = () => {
    props.onDeleteTemplate(templateToDelete, {
      onSuccess: () => setTemplateToDelete(null),
    });
  };

  const itemIdToSortedCompanyList = React.useMemo(() => {
    const activeDictionary = activeItemList.reduce<
      Record<number, FranchiseCompany[]>
    >((_dic, item: GenericProductTemplate) => {
      // eslint-disable-next-line no-param-reassign
      _dic[item.id] = sortCompanyListByIsAllowedAndName(
        getItemFranchiseCompanies(item),
      );
      return _dic;
    }, {});
    const inactiveDictionary = inactiveItemList.reduce<
      Record<number, FranchiseCompany[]>
    >((_dic, item: GenericProductTemplate) => {
      // eslint-disable-next-line no-param-reassign
      _dic[item.id] = sortCompanyListByIsAllowedAndName(
        getItemFranchiseCompanies(item),
      );
      return _dic;
    }, {});
    return { ...activeDictionary, ...inactiveDictionary };
  }, [activeItemList, inactiveItemList, getItemFranchiseCompanies]);

  const fuzzySearchItemList = props.fuzzySearchItemList ?? activeItemList;
  return (
    <div>
      {props.loading && <LinearProgress />}
      <IsEmptyList
        text={props.emptyExplainLabel}
        button={props.emptyButtonLabel}
        onCreate={props.onCreateTemplate}
        onCreateLabel={props.emptyButtonLabel}
        filledIcon
        hideEmptyText={!displayEmptyText}
        hideBottomActions={displayEmptyText}
      />
      <div className={classes.container}>
        {!displayEmptyText && props.withFuzzySearch && (
          <FuzzySearch
            placeholder={t('genericProduct.list.fuzzySearch')}
            // @ts-ignore
            searchFields={props.fuzzySearchSearchFields ?? ['name']}
            items={fuzzySearchItemList}
            itemRenderer={(item: GenericProductTemplate) => {
              if (
                fuzzySearchItemList.some((template) => template.id === item.id)
              ) {
                return (
                  <FranchiseGenericProductListItem
                    key={item.id}
                    id={item.id}
                    companies={itemIdToSortedCompanyList[item.id]}
                    primaryText={props.getItemPrimaryText(item)}
                    secondaryText={props.getItemSecondaryText(item)}
                    cover={!!props.getItemCover && props.getItemCover(item)}
                    withCover={!!props.getItemCover}
                    onClick={props.goToItemDetailPage}
                    onEdit={props.onUpdateTemplate}
                    onDelete={setTemplateToDelete}
                    t={t}
                    manager_only={!!item?.manager_only}
                  />
                );
              }
              return null;
            }}
            className={classes.fuzzySearch}
          />
        )}
        {activeItemList.length ? (
          <div>
            <Typography variant="h4">
              {`${
                props.activeItemListLabel ||
                t('genericProduct.list.titleActive')
              } (${activeItemList.length})`}
            </Typography>
            <Divider className={classes.divider} />
            <Paper>
              {activeItemList.map((item: GenericProductTemplate) => (
                <FranchiseGenericProductListItem
                  key={item.id}
                  id={item.id}
                  companies={itemIdToSortedCompanyList[item.id]}
                  primaryText={props.getItemPrimaryText(item)}
                  secondaryText={props.getItemSecondaryText(item)}
                  cover={!!props.getItemCover && props.getItemCover(item)}
                  withCover={!!props.getItemCover}
                  onClick={props.goToItemDetailPage}
                  onEdit={props.onUpdateTemplate}
                  onDelete={setTemplateToDelete}
                  t={t}
                  manager_only={!!item?.manager_only}
                />
              ))}
            </Paper>
          </div>
        ) : null}
        {inactiveItemList.length ? (
          <div
            className={classnames({
              [classes.secondList]: activeItemList?.length,
            })}
          >
            <Typography variant="h4">
              {`${
                props.inactiveItemListLabel ||
                t('genericProduct.list.titleInactive')
              } (${inactiveItemList.length})`}
            </Typography>
            <Divider className={classes.divider} />
            <Paper>
              {inactiveItemList.map((item: GenericProductTemplate) => (
                <FranchiseGenericProductListItem
                  key={item.id}
                  id={item.id}
                  companies={itemIdToSortedCompanyList[item.id]}
                  primaryText={props.getItemPrimaryText(item)}
                  secondaryText={props.getItemSecondaryText(item)}
                  cover={props.getItemCover && props.getItemCover(item)}
                  withCover={!!props.getItemCover}
                  onClick={props.goToItemDetailPage}
                  onEdit={props.onUpdateTemplate}
                  onDelete={setTemplateToDelete}
                  t={t}
                  manager_only={!!item?.manager_only}
                />
              ))}
            </Paper>
          </div>
        ) : null}
      </div>
      <GenericDeleteDialog
        open={!!templateToDelete}
        onCancel={() => setTemplateToDelete(null)}
        onValidate={onDeleteTemplate}
        content={props.deleteTemplateDialogContent}
        title={
          props.deleteTemplateDialogTitle ??
          t('genericProduct.dialogs.deleteTemplate.title')
        }
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingBottom: '10vh',
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  secondList: {
    marginTop: theme.spacing(5),
  },
  fuzzySearch: {
    marginBottom: theme.spacing(5),
  },
}));

export default FranchiseGenericProductDoubleList;
