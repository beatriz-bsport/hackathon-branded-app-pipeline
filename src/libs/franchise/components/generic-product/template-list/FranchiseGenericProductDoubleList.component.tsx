import React from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { LinearProgress, Typography, Divider, Paper } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import FuzzySearch from '#components/search/FuzzySearch.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import {
  FranchiseCompany,
  GenericProductTemplate,
} from '#libs/franchise/types';
import { sortCompanyListByIsAllowedAndName } from '#libs/franchise/utils';
import GenericDeleteDialog from '#components/genericDialog/GenericDeleteDialog.component';
import FranchiseGenericProductListItem from './FranchiseGenericProductListItem.component';
import { OptionCallback } from '../../../../../state/types';

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
      /* eslint-disable no-param-reassign */
      // @ts-expect-error
      _dic[item.id] = sortCompanyListByIsAllowedAndName(
        getItemFranchiseCompanies(item),
      );
      return _dic;
    }, {});
    const inactiveDictionary = inactiveItemList.reduce<
      Record<number, FranchiseCompany[]>
    >((_dic, item: GenericProductTemplate) => {
      // @ts-expect-error
      _dic[item.id] = sortCompanyListByIsAllowedAndName(
        getItemFranchiseCompanies(item),
      );
      return _dic;
    }, {});
    /* eslint-enable no-param-reassign */
    return { ...activeDictionary, ...inactiveDictionary };
  }, [activeItemList, inactiveItemList, getItemFranchiseCompanies]);

  const fuzzySearchItemList = props.fuzzySearchItemList ?? activeItemList;
  return (
    <div>
      {props.loading && <LinearProgress />}
      <IsEmptyList
        filledIcon
        button={props.emptyButtonLabel}
        hideBottomActions={displayEmptyText}
        hideEmptyText={!displayEmptyText}
        onCreate={props.onCreateTemplate}
        onCreateLabel={props.emptyButtonLabel}
        text={props.emptyExplainLabel}
      />
      <div className={classes.container}>
        {!displayEmptyText && props.withFuzzySearch && (
          <FuzzySearch
            className={classes.fuzzySearch}
            itemRenderer={(item: GenericProductTemplate) => {
              if (
                fuzzySearchItemList.some((template) => template.id === item.id)
              ) {
                return (
                  <FranchiseGenericProductListItem
                    key={item.id}
                    companies={itemIdToSortedCompanyList[item.id]}
                    cover={!!props.getItemCover && props.getItemCover(item)}
                    id={item.id}
                    // @ts-expect-error
                    manager_only={!!item?.manager_only}
                    onClick={props.goToItemDetailPage}
                    onDelete={setTemplateToDelete}
                    onEdit={props.onUpdateTemplate}
                    primaryText={props.getItemPrimaryText(item)}
                    secondaryText={props.getItemSecondaryText(item)}
                    t={t}
                    withCover={!!props.getItemCover}
                  />
                );
              }
              return null;
            }}
            items={fuzzySearchItemList}
            placeholder={t('genericProduct.list.fuzzySearch')}
            // @ts-expect-error
            searchFields={props.fuzzySearchSearchFields ?? ['name']}
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
                  companies={itemIdToSortedCompanyList[item.id]}
                  cover={!!props.getItemCover && props.getItemCover(item)}
                  id={item.id}
                  // @ts-expect-error
                  manager_only={!!item?.manager_only}
                  onClick={props.goToItemDetailPage}
                  onDelete={setTemplateToDelete}
                  onEdit={props.onUpdateTemplate}
                  primaryText={props.getItemPrimaryText(item)}
                  secondaryText={props.getItemSecondaryText(item)}
                  t={t}
                  withCover={!!props.getItemCover}
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
                  companies={itemIdToSortedCompanyList[item.id]}
                  cover={props.getItemCover && props.getItemCover(item)}
                  id={item.id}
                  // @ts-expect-error
                  manager_only={!!item?.manager_only}
                  onClick={props.goToItemDetailPage}
                  onDelete={setTemplateToDelete}
                  onEdit={props.onUpdateTemplate}
                  primaryText={props.getItemPrimaryText(item)}
                  secondaryText={props.getItemSecondaryText(item)}
                  t={t}
                  withCover={!!props.getItemCover}
                />
              ))}
            </Paper>
          </div>
        ) : null}
      </div>
      <GenericDeleteDialog
        content={props.deleteTemplateDialogContent}
        onCancel={() => setTemplateToDelete(null)}
        onValidate={onDeleteTemplate}
        open={!!templateToDelete}
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
