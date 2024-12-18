import React, { memo } from 'react';

import chroma from 'chroma-js';
import { colors } from '@bsport/common/lib/colors';
import Select from 'react-select';
import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import DelayedTextField from '#src/components/DelayedTextField.component';
import InboxThreadContextSelector from '#src/libs/communication-v2/thread/InboxThreadLookup/InboxThreadContextSelector.component';
import { threadFilteringChoices } from '#src/libs/communication-v2/utils';
import { SelectFieldItem } from '#src/libs/communication-v2/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type selectorStyle = { option: any };

type selectorStateType = {
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
};

export type Props = {
  filterValue: SelectFieldItem;
  handleFilterChange: (value: SelectFieldItem) => void;
  handleContextThreadChange: (context: ChatThreadKinds) => void;
  createNewThread: () => void;
  searchThread?: (search: string) => void;
  contextSelected: ChatThreadKinds;
};

const InboxThreadLookup: React.FC<Props> = ({
  filterValue,
  handleFilterChange,
  handleContextThreadChange,
  createNewThread,
  searchThread,
  contextSelected,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const useSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (searchThread) {
        searchThread(event.target.value);
      }
    },
    [searchThread],
  );

  return (
    <div className={classes.container}>
      <InboxThreadContextSelector
        contextSelected={contextSelected}
        handleContextThreadChange={handleContextThreadChange}
      />

      <div className={classes.secondGroup}>
        <div className={classes.searchThread}>
          <DelayedTextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            onChange={useSearch}
            placeholder={t('thread.search')}
            variant="outlined"
          />
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="member.allowed_actions.communication"
          >
            <div className={classes.newThreadContainer}>
              <IconButton
                className={classes.newThreadBackground}
                onClick={createNewThread}
              >
                <EditIcon className={classes.newThread} fontSize="medium" />
              </IconButton>
            </div>
          </ObjectLevelPermissionWrapper>
        </div>

        <Select
          closeMenuOnSelect
          onChange={handleFilterChange}
          options={threadFilteringChoices(t)}
          styles={{ ...selectorStyles }}
          value={filterValue}
        />
      </div>
    </div>
  );
};

const selectorStyles: selectorStyle = {
  option: (
    styles: any,
    { isDisabled, isFocused, isSelected }: selectorStateType,
  ) => {
    const color = chroma(colors.secondary);

    const backgroundColor = (_isFocused: boolean, _isSelected: boolean) => {
      let backColor = null;
      if (_isSelected) {
        backColor = color.alpha(0.1).css();
      } else if (_isFocused) {
        backColor = color.alpha(0.05).css();
      }
      return backColor;
    };

    return {
      ...styles,
      backgroundColor: backgroundColor(isFocused, isSelected),
      color: 'black',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && color.alpha(0.1).css(),
      },
    };
  },
};

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
  },
  searchThread: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  textFilter: {
    display: 'flex',
  },
  secondGroup: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  newThread: {
    color: theme.palette.common.black,
  },
  newThreadContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  newThreadBackground: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
  },
}));

export default memo(InboxThreadLookup);
