// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import MemberNotePanel from './MemberNotePanel.component';
import TagPanel from '../../tag/components/TagPanel.component';
import type { MemberNote } from '../types';
import type { Tag, TagGroup } from '../../tag/types';
import MemberFilesPanel from './MemberFilesPanel.component';

type Props = {
  notes: Array<MemberNote>,
  classes: Object,
  memberId: number,
  deleteNote: (id: number) => void,
  createOrUpdateNote: (any) => void,

  tagGroups: Array<TagGroup>,
  memberTags: Array<number>,
  createTagGroup: ({ name: string }) => void,
  createTag: ({ name: string, group: number }) => void,
  attributeTag: (tagId: number) => void,
  deleteTagGroup: (tagGroupId: number) => void,
  deleteTag: (id: number) => void,
  updateTag: (Tag) => void,
  updateTagGroup: ({ name: string, id: number }) => void,
  openFileUploadDialog: boolean,
  tagGroupsLoading: boolean,
  deleteFile: (id: number) => void,
  uploadedFiles: any,
};

export const MemberCRM = (props: Props) => (
  <Paper className={props.classes.noteContainer}>
    <TagPanel
      tagGroups={props.tagGroups}
      attributedTags={props.memberTags}
      createTagGroup={props.createTagGroup}
      createTag={props.createTag}
      attributeTag={props.attributeTag}
      deleteTagGroup={props.deleteTagGroup}
      tagGroupsLoading={props.tagGroupsLoading}
      deleteTag={props.deleteTag}
      updateTag={props.updateTag}
      updateTagGroup={props.updateTagGroup}
    />
    <div className={props.classes.separator} />
    <MemberNotePanel
      notes={props.notes.filter((n) => n.is_medical)}
      createOrUpdateNote={(data: *) =>
        props.createOrUpdateNote({ ...data, is_medical: true })
      }
      deleteNote={props.deleteNote}
      memberId={props.memberId}
      healthNotes
    />
    <div className={props.classes.separator} />
    <MemberNotePanel
      notes={props.notes.filter((n) => !n.is_medical)}
      createOrUpdateNote={(data: *) =>
        props.createOrUpdateNote({ ...data, is_medical: false })
      }
      deleteNote={props.deleteNote}
      memberId={props.memberId}
    />
    <div className={props.classes.separator} />
    <MemberFilesPanel
      openFileUploadDialog={props.openFileUploadDialog}
      uploadedFiles={props.uploadedFiles}
      onDelete={props.deleteFile}
    />
  </Paper>
);

const styles = (theme) => ({
  accountBalance: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit * 2,
    border: '2px solid #E8E8E8',
  },
  noteContainer: {
    padding: theme.spacing.unit * 2,
  },
  separator: {
    marginTop: theme.spacing.unit * 3,
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles),
)(MemberCRM);
