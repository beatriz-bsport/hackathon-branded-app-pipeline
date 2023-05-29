import React, { memo } from 'react';

import chroma from 'chroma-js';
import { colors } from '@bsport/common/lib/colors';
import Select from 'react-select';
import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import DelayedTextField from '#components/DelayedTextField.component';
import InboxThreadContextSelector from '#libs/communication-v2/thread/InboxThreadLookup/InboxThreadContextSelector';
import { choices } from '#libs/communication-v2/utils';
import { SelectFieldItem } from '#libs/communication-v2/types';

type selectorStyle = { option: any };

type selectorStateType = {
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
};

export type Props = {
  searchThread: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterValue: SelectFieldItem;
  filterValueSetter: (value: SelectFieldItem) => void;
  fetchMemberThreads: () => void;
  fetchSmartlistThreads: () => void;
  fetchOfferThreads: () => void;
  createNewThread: () => void;
  contextSelected: ChatThreadKinds;
  setContextSelected: (context: ChatThreadKinds) => void;
};

const InboxThreadLookup: React.FC<Props> = ({
  searchThread,
  filterValue,
  filterValueSetter,
  fetchMemberThreads,
  fetchSmartlistThreads,
  fetchOfferThreads,
  createNewThread,
  contextSelected,
  setContextSelected,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <InboxThreadContextSelector
        fetchMemberThreads={fetchMemberThreads}
        fetchSmartlistThreads={fetchSmartlistThreads}
        fetchOfferThreads={fetchOfferThreads}
        contextSelected={contextSelected}
        setContextSelected={setContextSelected}
      />

      <div className={classes.secondGroup}>
        <div className={classes.searchThread}>
          <DelayedTextField
            onChange={searchThread}
            placeholder={t('thread.search')}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.newThreadContainer}>
            <IconButton
              onClick={createNewThread}
              className={classes.newThreadBackground}
            >
              <EditIcon fontSize="medium" className={classes.newThread} />
            </IconButton>
          </div>
        </div>

        <Select
          closeMenuOnSelect
          options={choices(t)}
          value={filterValue}
          styles={{ ...selectorStyles }}
          onChange={filterValueSetter}
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
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
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
    paddingBottom: theme.spacing(2),
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
