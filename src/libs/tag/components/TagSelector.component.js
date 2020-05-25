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
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

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
  menuAnchorEl: ?HTMLElement,
  setMenuAnchor: (?HTMLElement) => void,
};

export function TagSelector(props: Props) {
  const { tag, tagGroup } = props;
  return (
    <div className={props.classes.tagSelectorContainer}>
      <IconButton onClick={props.onToogleCreate}>
        <AddIcon />
      </IconButton>
      <div className={props.classes.userInput}>
        <Selector
          isClearable
          onChange={(suggestion) => {
            if (!suggestion && tag && tag.id) {
              props.untag(tag.id);
            } else {
              props.selectTag(suggestion.value);
            }
          }}
          onCreateOption={(name) => {
            props.onCreate({ name });
          }}
          placeholder={props.t('tag.noTagAttributed')}
          selected={tag ? tag.id : null}
          suggestions={
            tagGroup
              ? tagGroup.tags.asMutable().map((ta) => ({
                  value: ta.id,
                  label: ta.name,
                }))
              : []
          }
        />
      </div>
      <IconButton onClick={(event) => props.setMenuAnchor(event.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={props.menuAnchorEl}
        open={Boolean(props.menuAnchorEl)}
        onClose={() => props.setMenuAnchor(null)}
      >
        <MenuItem onClick={() => props.editTagGroup(tagGroup)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          {props.t('form.group.edit')}
        </MenuItem>
        <MenuItem onClick={() => props.deleteTagGroup(tagGroup)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          {props.t('form.group.deleteCategory')}
        </MenuItem>
      </Menu>
    </div>
  );
}

const styles = () => ({
  tagSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInput: {
    width: 200,
  },
});

export default compose(
  withTranslation(['tag']),
  withStyles(styles),
  withState('menuAnchorEl', 'setMenuAnchor', null),
)(TagSelector);
