import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import Popover from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core';

import DelayedTextField from '../../../components/DelayedTextField.component';

import type { RolePermission } from '#libs/role/types';
import type { MemberMinimal } from '#libs/member/types';

type Props = {
  disabled?: boolean;
  fullWidth?: boolean;
  memberHistory?: MemberMinimal[];
  memberHistoryAnchor?: HTMLElement;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickRegister?: (Member: MemberMinimal) => void;
  onReset: () => void;
  permissions?: RolePermission;
  placeholder?: string;
  searchedText: string;
  setMemberHistoryAnchor?: (event: HTMLElement) => void;
};

const MemberSearchBar: React.FC<Props> = ({
  disabled,
  fullWidth,
  memberHistory,
  memberHistoryAnchor,
  onChange,
  onClickRegister,
  onReset,
  permissions,
  placeholder,
  searchedText,
  setMemberHistoryAnchor,
}) => {
  const { t } = useTranslation('search');
  const classes = useStyles();

  const handleBlur = useCallback(() => {
    setMemberHistoryAnchor?.(null);
  }, [setMemberHistoryAnchor]);

  const handleFocus = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      setMemberHistoryAnchor?.(ev.currentTarget);
    },
    [setMemberHistoryAnchor],
  );

  return (
    <div className={classNames({ [classes.input]: fullWidth })}>
      <Popover
        transition
        anchorEl={memberHistoryAnchor}
        open={!!memberHistoryAnchor && !!memberHistory?.length}
        style={{ zIndex: 1000000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {(memberHistory?.slice(0, 5) ?? []).map((member) => (
                <ListItem
                  key={member.id}
                  button
                  divider
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickRegister?.(member);
                  }}
                >
                  <ListItemText
                    primary={member.name}
                    secondary={permissions?.member?.search ? member.email : ''}
                  />
                </ListItem>
              ))}
            </Paper>
          </Fade>
        )}
      </Popover>
      <DelayedTextField
        fullWidth
        className={classes.field}
        disabled={disabled}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchedText ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={searchedText ? 'Clear search' : 'Search'}
                onClick={onReset}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        placeholder={placeholder ?? t('input')}
        value={searchedText}
        variant="outlined"
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  input: {
    width: '100%',
  },
  field: {
    backgroundColor: '#F8F8F8',
    width: '100%',
  },
}));

export default React.memo(MemberSearchBar);
