import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';

// @ts-ignore
import MemberNotePanel from './MemberNotePanel.component';
// @ts-ignore
import TagPanel from '../../tag/components/TagPanel.component';
import { MemberNote, Member, MemberUploadedFile } from '../types';
import { Tag, TagGroup } from '../../tag/types';
import MemberFilesPanel from './MemberFilesPanel.component';
import MemberPaymentMethodPanel from './MemberPaymentMethodPanel.component';
import SpiviPrivacySettingsPanel from '../../spivi/components/SpiviPrivacySettingsPanel.component';

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
  snackbarSuccessMsg: (msg: string) => void;

  openAddPaymentMethodDialog: (isDialogOpen: boolean) => void;

  companyId?: number;
  updateSpiviPrivacySettings: (memberId: number, value: boolean) => void;
  spiviPrivacySettingsLoading: boolean;
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
    companyId,
  } = props;

  const classes = useStyles();

  const createMedicalNote = React.useCallback(
    (note: MemberNote) => {
      createOrUpdateNote({ ...note, is_medical: true });
    },
    [createOrUpdateNote],
  );

  const createNonMedicalNote = React.useCallback(
    (note: MemberNote) => {
      createOrUpdateNote({ ...note, is_medical: false });
    },
    [createOrUpdateNote],
  );

  const medicalNotes = React.useMemo(
    () => notes.filter((n) => n.is_medical),
    [notes],
  );

  const notMedicalNotes = React.useMemo(
    () => notes.filter((n) => !n.is_medical),
    [notes],
  );

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
        notes={medicalNotes}
        createOrUpdateNote={createMedicalNote}
        deleteNote={deleteNote}
        memberId={memberId}
        healthNotes
      />
      <div className={classes.separator} />
      <MemberNotePanel
        notes={notMedicalNotes}
        createOrUpdateNote={createNonMedicalNote}
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
        snackbarSuccess={props.snackbarSuccessMsg}
        companyId={companyId}
        paymentMethod={paymentMethod}
        paymentMethodLoading={paymentMethodLoading}
        detachPaymentMethod={detachPaymentMethod}
        detachPaymentMethodLoading={detachPaymentMethodLoading}
        openAddPaymentMethodDialog={props.openAddPaymentMethodDialog}
      />
      {props.member?.spivi_privacy_settings_accepted !== null &&
        props.member?.spivi_privacy_settings_accepted !== undefined && (
          <div>
            <div className={classes.separator} />
            <SpiviPrivacySettingsPanel
              member={props.member}
              updateSpiviPrivacySettings={props.updateSpiviPrivacySettings}
              spiviPrivacySettingsLoading={props.spiviPrivacySettingsLoading}
            />
          </div>
        )}
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
