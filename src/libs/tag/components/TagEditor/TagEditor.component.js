// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';

import type { TagGroup, Tag } from '../../types';

import TagCreator from '../TagCreator.component';
import TagSelector from '../TagSelector.component';
import TagGroupForm from '../TagGroupForm.component';
import { useCreateHandler, useEditHandler } from './hooks';

type Props = {
  tagGroup: TagGroup,
  tag: Tag,

  selectTag: (id: number) => void,
  untag: (id: number) => void,
  deleteTagGroup: (TagGroup) => void,
  onCreate: (data: { name: string }) => void,
  updateTag: (Tag) => void,
  updateTagGroup: ({ name: string, id: number }) => void,
  deleteTag: (number) => void,

  editMode: boolean,
  setEditMode: (boolean) => void,
  createMode: boolean,
  setCreateMode: (boolean) => void,
  classes: Object,
  disabled: boolean,
};

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  tagSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export function TagEditor(props: Props) {
  const {
    classes,
    tagGroup,
    tag,
    editMode,
    disabled,
    onCreate,
    deleteTagGroup,
    setCreateMode,
    setEditMode,
    updateTagGroup,
    updateTag,
    deleteTag,
  } = props;

  const [handleCreateTag, handleToggleCreate, handleOnCancel] =
    useCreateHandler({ setCreateMode, onCreate });

  const [handleEditTag, handleTagGroupFormClose] = useEditHandler({
    setEditMode,
  });

  if (editMode) {
    return (
      <TagGroupForm
        tagGroup={tagGroup}
        updateTag={updateTag}
        deleteTag={deleteTag}
        deleteTagGroup={deleteTagGroup}
        updateTagGroup={updateTagGroup}
        onClose={handleTagGroupFormClose}
      />
    );
  }

  return (
    <div className={classes.container}>
      <div style={{ minWidth: '100px' }}>
        <Typography variant="subtitle2" noWrap>
          {tagGroup.name}
        </Typography>
      </div>

      <div className={classes.tagSelectorContainer}>
        {props.createMode ? (
          <TagCreator
            onCreate={handleCreateTag}
            onCancel={handleOnCancel}
            disabled={props.disabled}
          />
        ) : (
          <TagSelector
            tag={tag}
            tagGroup={tagGroup}
            onToogleCreate={handleToggleCreate}
            selectTag={props.selectTag}
            untag={props.untag}
            deleteTagGroup={deleteTagGroup}
            editTagGroup={handleEditTag}
            onCreate={onCreate}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}

export default compose(
  withStyles(styles),
  withState('createMode', 'setCreateMode', false),
  withState('editMode', 'setEditMode', false),
)(TagEditor);
