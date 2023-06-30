import React, { memo } from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from 'react-select';
import { getFilterOptionsForFilteringByMemberCategory } from '#libs/communication-v2/utils';
import {
  SelectFieldItem,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';

export type Props = {
  checkedFilters: number[];
  setCheckedFilters: (newList: number[]) => void;
  genericMemberCategories: FilteringMemberIdsByGenericCategories;
};

export const CommunicationInformationModalFilter = (props: Props) => {
  const classes = useStyles();
  const { genericMemberCategories, checkedFilters, setCheckedFilters } = props;
  const filterOptions: Array<SelectFieldItem> =
    getFilterOptionsForFilteringByMemberCategory(genericMemberCategories);
  const filterValues = filterOptions.filter((field: SelectFieldItem) =>
    checkedFilters.includes(field.value),
  );
  const handleFilterChange = (selectedFields: SelectFieldItem[]) => {
    setCheckedFilters(selectedFields.map((field) => field.value));
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

export default memo(CommunicationInformationModalFilter);
