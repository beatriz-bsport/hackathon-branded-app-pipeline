// @flow
import React from 'react';
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
import Permission from '../../libs/role/types';

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
  permissions: Permission,
};

export function SearchMember(props: Props) {
  const { classes, t, onReset, searchedText, permissions, onChange } = props;
  return (
    <div>
      <Popover
        style={{ zIndex: 1000000 }}
        disableAutoFocus
        anchorEl={props.memberHistoryAnchor}
        open={
          Boolean(props.memberHistoryAnchor) && !!props.memberHistory.length
        }
        placement="center"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {props.memberHistory.map((m) => (
                <ListItem
                  key={m.id}
                  divider
                  button
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
        variant="outlined"
        className={classes.field}
        placeholder={t('input')}
        fullWidth
        onBlur={() => {
          if (props.setMemberHistoryAnchor) {
            props.setMemberHistoryAnchor(null);
          }
        }}
        onFocus={(ev) => {
          if (props.setMemberHistoryAnchor) {
            props.setMemberHistoryAnchor(ev.currentTarget);
          }
        }}
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
        value={searchedText}
        onChange={onChange}
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

export default withTranslation(['search'])(withStyles(styles)(SearchMember));
