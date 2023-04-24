// @ts-nocheck
import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { ListItem, ListItemText, Checkbox } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { FilteringMemberIdsByGenericCategories } from '#libs/communication-v2/types';

export type Props = {
  genericMemberCategories: FilteringMemberIdsByGenericCategories;
  checkedFilters: number[];
  setCheckedFilters: (nextList: number[]) => void;
};

export const CommunicationRecipientModalFilter = (props: Props) => {
  const classes = useStyles();
  const { genericMemberCategories, checkedFilters, setCheckedFilters } = props;
  const onCheckFilter = (identifier: number) => {
    const filterIndex = checkedFilters.indexOf(identifier);
    const nextFilterValues = [...checkedFilters];
    if (filterIndex === -1) {
      nextFilterValues.push(identifier);
    } else {
      nextFilterValues.splice(filterIndex, 1);
    }
    setCheckedFilters(nextFilterValues);
  };
  return (
    <div className={classes.checkboxContainer}>
      {genericMemberCategories?.categories?.length > 0 &&
        genericMemberCategories.categories.map((memberCategory, index) => (
          <ListItem
            key={`item-${index}-${memberCategory.categoryIdentifier}`}
            button
            onClick={() => onCheckFilter(memberCategory.categoryIdentifier)}
            className={classes.checkboxDisableHover}
          >
            <Checkbox
              edge="start"
              checked={checkedFilters?.includes(
                memberCategory.categoryIdentifier,
              )}
              disableRipple
              disableTouchRipple
            />
            <ListItemText
              id={`text-${index}-${memberCategory.categoryIdentifier}`}
              primary={memberCategory.categoryLabel}
            />
          </ListItem>
        ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  checkboxContainer: {
    alignSelf: 'flex-start',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  checkboxDisableHover: {
    width: '100%',
    '&:hover': {
      backgroundColor: '#fff',
    },
    paddingBottom: 0,
    paddingTop: 0,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}));

export default CommunicationRecipientModalFilter;
