// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';

import MemberNotePanel from './MemberNotePanel.component';
import TagPanel from '../../tag/components/TagPanel.component';
import { MemberNote, Member, MemberUploadedFile } from '../types';
import { Tag, TagGroup } from '../../tag/types';
import MemberFilesPanel from './MemberFilesPanel.component';
import { MemberPaymentMethodPanel } from './MemberPaymentMethodPanel.component';

type Props = {
  member: Member;
  memberId: number;

  notes: Array<MemberNote>;
  deleteNote: (id: number) => void;
  createOrUpdateNote: (note: MemberNote) => void;

  tagGroups: Array<TagGroup>;
  memberTags: Array<number>;
  createTagGroup: (tag: TagGroup) => void;
  createTag: (tag: Tag) => void;
  attributeTag: (tagId: number) => void;
  untag: (tagId: number) => void;
  deleteTagGroup: (tagGroupId: number) => void;
  deleteTag: (id: number) => void;
  updateTag: (tag: Tag) => void;
  updateTagGroup: (tagGroup: TagGroup) => void;

  openFileUploadDialog: () => void;
  tagGroupsLoading: boolean;
  deleteFile: (id: number) => void;
  uploadedFiles: MemberUploadedFile[];
  updateVisibility: (file: MemberUploadedFile) => () => void;

  paymentMethod: Array<any>;
  paymentMethodLoading: boolean;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;

  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
};

export const MemberCRM = (props: Props) => {
  const {
    member,
    memberId,
    // notes
    notes,
    deleteNote,
    createOrUpdateNote,
    // tags
    tagGroups,
    memberTags,
    createTagGroup,
    createTag,
    attributeTag,
    untag,
    deleteTagGroup,
    deleteTag,
    updateTag,
    updateTagGroup,
    // Files
    uploadedFiles,
    openFileUploadDialog,
    tagGroupsLoading,
    deleteFile,
    updateVisibility,
    // payment
    paymentMethod,
    paymentMethodLoading,
    detachPaymentMethodLoading,
    detachPaymentMethod,
    // utils
    snackbarErrorMsg,
    snackbarSuccessMsg,
  } = props;

  const classes = useStyles();

  const createNote =
    ({ isMedical }: { isMedical: boolean }) =>
    (note: MemberNote) => {
      createOrUpdateNote({ ...note, is_medical: isMedical });
    };

  return (
    <Paper className={classes.noteContainer}>
      <TagPanel
        tagGroups={tagGroups}
        attributedTags={memberTags}
        createTagGroup={createTagGroup}
        createTag={createTag}
        attributeTag={attributeTag}
        untag={untag}
        deleteTagGroup={deleteTagGroup}
        tagGroupsLoading={tagGroupsLoading}
        deleteTag={deleteTag}
        updateTag={updateTag}
        updateTagGroup={updateTagGroup}
        member={member}
      />
      <div className={classes.separator} />
      <MemberNotePanel
        notes={notes.filter((n) => n.is_medical)}
        createOrUpdateNote={createNote({ isMedical: true })}
        deleteNote={deleteNote}
        memberId={memberId}
        healthNotes
      />
      <div className={classes.separator} />
      <MemberNotePanel
        notes={notes.filter((n) => !n.is_medical)}
        createOrUpdateNote={createNote({ isMedical: false })}
        deleteNote={deleteNote}
        memberId={memberId}
      />
      <div className={classes.separator} />
      <MemberFilesPanel
        openFileUploadDialog={openFileUploadDialog}
        uploadedFiles={uploadedFiles}
        onDelete={deleteFile}
        updateVisibility={updateVisibility}
      />
      <div className={classes.separator} />
      <MemberPaymentMethodPanel
        memberId={memberId}
        paymentMethod={paymentMethod}
        paymentMethodLoading={paymentMethodLoading}
        detachPaymentMethod={detachPaymentMethod}
        detachPaymentMethodLoading={detachPaymentMethodLoading}
        snackbarErrorMsg={snackbarErrorMsg}
        snackbarSuccessMsg={snackbarSuccessMsg}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  accountBalance: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2),
    border: '2px solid #E8E8E8',
  },
  noteContainer: {
    padding: theme.spacing(2),
  },
  separator: {
    marginTop: theme.spacing(3),
  },
}));

export default MemberCRM;
