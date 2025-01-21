// @flow
import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { compose, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import Selector from '../../../components/Selector.component';

import type { TagGroup, Tag } from '../types';

type Props = {
  tagGroup: TagGroup,
  tag: Tag,

  selectTag: (id: number) => void,
  untag: (id: number) => void,
  deleteTagGroup: (TagGroup) => void,
  editTagGroup: (TagGroup) => void,
  onCreate: ({ name: string }) => void,

  onToogleCreate: () => void,

  t: TFunction,
  classes: Object,
  menuAnchorEl?: HTMLElement,
  setMenuAnchor: (anchor?: HTMLElement) => void,
  disabled: boolean,
};

export function TagSelector(props: Props) {
  const {
    tag,
    tagGroup,
    classes,
    disabled,
    menuAnchorEl,
    onCreate,
    selectTag,
    setMenuAnchor,
    editTagGroup,
    deleteTagGroup,
    onToogleCreate,
    untag,
    t,
  } = props;

  const handleOnCreateOption = React.useCallback(
    (name) => {
      onCreate({ name });
    },
    [onCreate],
  );

  const handleChangeOption = React.useCallback(
    (suggestion) => {
      if (!suggestion && tag && tag.id) {
        untag(tag.id);
      } else if (suggestion) {
        selectTag(suggestion.value);
      }
    },
    [tag, untag, selectTag],
  );

  const handleCloseMenu = React.useCallback(
    () => setMenuAnchor(null),
    [setMenuAnchor],
  );

  const handleTagGroupEdit = React.useCallback(
    () => editTagGroup(tagGroup),
    [editTagGroup, tagGroup],
  );

  const handleTagGroupDelete = React.useCallback(
    () => deleteTagGroup(tagGroup),
    [deleteTagGroup, tagGroup],
  );

  const handleSetMenuAnchor = React.useCallback(
    (event) => setMenuAnchor(event.currentTarget),
    [setMenuAnchor],
  );

  const suggestions = React.useMemo(
    () =>
      tagGroup
        ? [...tagGroup.tags].map((tagItem) => ({
            value: tagItem.id,
            label: tagItem.name,
          }))
        : [],
    [tagGroup],
  );

  return (
    <div className={classes.tagSelectorContainer}>
      {!disabled && (
        <IconButton disabled={disabled} onClick={onToogleCreate}>
          <AddIcon />
        </IconButton>
      )}
      <div className={classes.selectorContainer}>
        <div className={classes.userInput}>
          <Selector
            isClearable
            isDisabled={disabled}
            onChange={handleChangeOption}
            onCreateOption={handleOnCreateOption}
            placeholder={t('tag.noTagAttributed')}
            selected={tag ? tag.id : null}
            suggestions={suggestions}
          />
        </div>
        {!disabled && (
          <>
            <IconButton onClick={handleSetMenuAnchor}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              id="simple-menu"
              onClose={handleCloseMenu}
              open={Boolean(menuAnchorEl)}
            >
              <MenuItem onClick={handleTagGroupEdit}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                {t('form.group.edit')}
              </MenuItem>
              <MenuItem onClick={handleTagGroupDelete}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                {t('form.group.deleteCategory')}
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
}

const styles = (theme: Theme) => ({
  tagSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
    },
  },
  userInput: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '5rem',
      width: '18rem',
    },
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto',
    },
  },
});

export default compose(
  withTranslation(['tag']),
  withStyles(styles),
  withState('menuAnchorEl', 'setMenuAnchor', null),
)(TagSelector);
