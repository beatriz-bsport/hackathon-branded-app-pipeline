// @flow
import React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { withTranslation, TFunction } from 'react-i18next';
import Popover from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DelayedTextField from '../../components/DelayedTextField.component';
import { RolePermission } from '../../libs/role/types';

type Props = {
  classes: Object,
  t: TFunction,
  onReset: () => void,
  searchedText: string,
  onChange: (e: SyntheticEvent<HTMLElement>) => void,
  memberHistory: Array<Member>,
  memberHistoryAnchor: ?HTMLElement,
  setMemberHistoryAnchor: (HTMLElement) => void,
  onClickRegister: (Member) => void,
  permissions: RolePermission,
  fullWidth?: boolean,
};

export function SearchMember(props: Props) {
  const {
    classes,
    t,
    onReset,
    searchedText,
    permissions,
    onChange,
    fullWidth,
  } = props;
  return (
    <div className={classNames({ [classes.input]: fullWidth })}>
      <Popover
        disableAutoFocus
        transition
        anchorEl={props.memberHistoryAnchor}
        open={
          Boolean(props.memberHistoryAnchor) && !!props.memberHistory.length
        }
        placement="center"
        style={{ zIndex: 1000000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {props.memberHistory.slice(0, 5).map((m) => (
                <ListItem
                  key={m.id}
                  button
                  divider
                  onClick={(ev) => {
                    ev.stopPropagation();
                    props.onClickRegister(m);
                  }}
                >
                  <ListItemText
                    primary={m.name}
                    secondary={permissions?.member?.search ? m.email : ''}
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
        onBlur={() => {
          if (props.setMemberHistoryAnchor) {
            props.setMemberHistoryAnchor(null);
          }
        }}
        onChange={onChange}
        onFocus={(ev) => {
          if (props.setMemberHistoryAnchor) {
            props.setMemberHistoryAnchor(ev.currentTarget);
          }
        }}
        placeholder={t('input')}
        value={searchedText}
        variant="outlined"
      />
    </div>
  );
}

const styles = () => ({
  input: {
    width: '100%',
  },
  field: {
    backgroundColor: '#F8F8F8',
    width: '100%',
  },
});

export default withTranslation(['search'])(
  withStyles(styles)(React.memo(SearchMember)),
);
