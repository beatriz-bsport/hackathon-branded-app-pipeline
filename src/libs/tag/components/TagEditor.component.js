// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose, withState } from 'recompose';

import type { TagGroup, Tag } from '../types';

import TagCreator from './TagCreator.component';
import TagSelector from './TagSelector.component';
import TagGroupForm from './TagGroupForm.component';

type Props = {
  tagGroup: TagGroup,
  tag: Tag,

  selectTag: (id: number) => void,
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
};

const styles = () => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export function TagEditor(props: Props) {
  const { classes, tagGroup, tag } = props;
  if (props.editMode) {
    return (
      <TagGroupForm
        tagGroup={tagGroup}
        updateTag={props.updateTag}
        deleteTag={props.deleteTag}
        deleteTagGroup={props.deleteTagGroup}
        updateTagGroup={props.updateTagGroup}
        onClose={() => props.setEditMode(false)}
      />
    );
  }

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2">{tagGroup.name}</Typography>
      <div className={classes.tagSelectorContainer}>
        {props.createMode ? (
          <TagCreator
            onCreate={(data) => {
              props.onCreate(data);
              props.setCreateMode(false);
            }}
            onCancel={() => props.setCreateMode(false)}
          />
        ) : (
          <TagSelector
            tag={tag}
            tagGroup={tagGroup}
            onToogleCreate={() => props.setCreateMode(true)}
            selectTag={props.selectTag}
            deleteTagGroup={props.deleteTagGroup}
            editTagGroup={() => props.setEditMode(true)}
            onCreate={props.onCreate}
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
