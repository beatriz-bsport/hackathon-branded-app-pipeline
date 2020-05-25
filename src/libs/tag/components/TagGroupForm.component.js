// @flow
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import withStyles from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import { darken } from '@material-ui/core/styles/colorManipulator';
import RedButton from '../../../components/button/RedButton.component';

import type { Tag, TagGroup } from '../types';

type Props = {
  tagGroup: TagGroup,
  updateTag: (Tag) => void,
  deleteTag: (Tag) => void,
  deleteTagGroup: (TagGroup) => void,
  updateTagGroup: (TagGroup) => void,
  onClose: () => void,

  classes: Object,
  t: TFunction,
};

class EditableTag extends Component<
  {
    tag: Tag,
    delete?: () => void,
    updateTag: (Tag | TagGroup) => void,
    key?: string,
  },
  { editMode: boolean, name: string },
> {
  constructor(props) {
    super(props);
    this.state = { editMode: false, name: props.tag.name };
  }

  render() {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        key={this.props.key}
      >
        {this.state.editMode ? (
          <IconButton
            onClick={() => {
              this.props.updateTag({
                ...this.props.tag,
                name: this.state.name,
              });
              this.setState({ editMode: false });
            }}
          >
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => this.setState({ editMode: true })}>
            <EditIcon />
          </IconButton>
        )}
        <TextField
          style={{ width: 200 }}
          value={this.state.name}
          disabled={!this.state.editMode}
          onChange={(ev) => this.setState({ name: ev.target.value })}
        />
        {this.props.delete ? (
          <IconButton onClick={this.props.delete}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </div>
    );
  }
}

export const TagGroupForm = (props: Props) => {
  const {
    tagGroup,
    updateTag,
    deleteTag,
    updateTagGroup,
    onClose,
    t,
    classes,
  } = props;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <EditableTag tag={tagGroup} updateTag={updateTagGroup} />
        <IconButton onClick={onClose}>
          <CancelIcon />
        </IconButton>
      </div>
      <Divider />
      <div className={classes.editableTagsContainer}>
        {tagGroup.tags.map((tag) => (
          <EditableTag
            key={'{tag.id}'}
            tag={tag}
            delete={() => deleteTag(tag)}
            updateTag={updateTag}
          />
        ))}
        <RedButton
          className={classes.deleteGroupButton}
          variant="outlined"
          onClick={() => props.deleteTagGroup(tagGroup)}
        >
          {t('form.group.deleteCategory')}
        </RedButton>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: 0,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
    border: '1px solid #E8E8E8',
    borderRadius: 8,
    backgroundColor: darken(darken(darken(theme.palette.background.paper))),
  },
  deleteGroupButton: {
    marginTop: theme.spacing(2),
  },
  editableTagsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    felxDirection: 'row',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['tag']),
)(TagGroupForm);
