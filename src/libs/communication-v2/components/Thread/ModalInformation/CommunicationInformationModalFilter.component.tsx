import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from 'react-select';
import sortedUniq from 'lodash/sortedUniq';
import { getFilterOptionsForFilteringByMemberCategory } from '#libs/communication-v2/utils';
import {
  SelectFieldItem,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';

export type Props = {
  allMemberIdList: number[];
  setMemberIdList: (newList: number[]) => void;
  genericMemberCategories: FilteringMemberIdsByGenericCategories;
};

export const CommunicationInformationModalFilter = (props: Props) => {
  const classes = useStyles();
  const { genericMemberCategories } = props;
  const filterOptions = getFilterOptionsForFilteringByMemberCategory(
    genericMemberCategories,
  );
  const [filterValues, setFilterValues] =
    useState<SelectFieldItem[]>(undefined);
  const handleFilterChange = (selectedFields: SelectFieldItem[]) => {
    let newMemberIdList: number[] = [];
    setFilterValues(selectedFields);
    if (!selectedFields?.length) {
      newMemberIdList = newMemberIdList.concat(props.allMemberIdList);
    } else {
      selectedFields.forEach((field: SelectFieldItem) => {
        const categoryToAdd = genericMemberCategories.categories.find(
          (category) => category.categoryIdentifier === field.value,
        );
        if (categoryToAdd)
          newMemberIdList = newMemberIdList.concat(
            categoryToAdd.categoryMemberIdList.filter((id) =>
              props.allMemberIdList.includes(id),
            ),
          );
      });
    }
    props.setMemberIdList(
      sortedUniq(newMemberIdList.sort((id, _id) => id - _id)),
    );
  };

  return (
    <Select
      value={filterValues}
      options={filterOptions}
      onChange={handleFilterChange}
      isMulti
      placeholder={genericMemberCategories.filterPlaceholder}
      className={classes.filterSelector}
    />
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  filterSelector: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

export default CommunicationInformationModalFilter;
