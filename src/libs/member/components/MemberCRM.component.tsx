import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';

// @ts-ignore
import MemberNotePanel from './MemberNotePanel.component';
// @ts-ignore
import TagPanel from '../../tag/components/TagPanel.component';
import type { MemberNote, Member, MemberUploadedFile } from '../types';
import type { Tag, TagGroup } from '../../tag/types';
import MemberFilesPanel from './MemberFilesPanel.component';
import MemberPaymentMethodPanel from './MemberPaymentMethodPanel.component';
import SpiviPrivacySettingsPanel from '../../spivi/components/SpiviPrivacySettingsPanel.component';
import MemberReferralPanel from './MemberReferralPanel';

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

  is_referral_program_activated: boolean;
  referralLink: string | null;
  nbRemainingReferralUses: number | null;
  maxReferralUses: number | null;
};

export const MemberCRM: React.FC<Props> = (props) => {
  const {
    member,
    memberId,
    companyId,
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
    // referral
    referralLink,
    nbRemainingReferralUses,
    maxReferralUses,
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

  const is_not_pos_member = member && !member.is_pos;

  return (
    <Paper className={classes.noteContainer}>
      {is_not_pos_member && (
        <TagPanel
          attributedTags={memberTags}
          attributeTag={attributeTag}
          createTag={createTag}
          createTagGroup={createTagGroup}
          deleteTag={deleteTag}
          deleteTagGroup={deleteTagGroup}
          member={member}
          tagGroups={tagGroups}
          tagGroupsLoading={tagGroupsLoading}
          untag={untag}
          updateTag={updateTag}
          updateTagGroup={updateTagGroup}
        />
      )}
      <div className={classes.separator} />
      <MemberNotePanel
        healthNotes
        createOrUpdateNote={createMedicalNote}
        deleteNote={deleteNote}
        memberId={memberId}
        notes={medicalNotes}
      />
      <div className={classes.separator} />
      <MemberNotePanel
        createOrUpdateNote={createNonMedicalNote}
        deleteNote={deleteNote}
        memberId={memberId}
        notes={notMedicalNotes}
      />
      <div className={classes.separator} />
      <MemberFilesPanel
        onDelete={deleteFile}
        openFileUploadDialog={openFileUploadDialog}
        updateVisibility={updateVisibility}
        uploadedFiles={uploadedFiles}
      />
      <div className={classes.separator} />
      {is_not_pos_member && (
        <MemberPaymentMethodPanel
          companyId={companyId}
          detachPaymentMethod={detachPaymentMethod}
          detachPaymentMethodLoading={detachPaymentMethodLoading}
          openAddPaymentMethodDialog={props.openAddPaymentMethodDialog}
          paymentMethod={paymentMethod}
          paymentMethodLoading={paymentMethodLoading}
          snackbarSuccess={props.snackbarSuccessMsg}
        />
      )}
      {props.member?.spivi_privacy_settings_accepted !== null &&
        props.member?.spivi_privacy_settings_accepted !== undefined && (
          <div>
            <div className={classes.separator} />
            <SpiviPrivacySettingsPanel
              member={props.member}
              spiviPrivacySettingsLoading={props.spiviPrivacySettingsLoading}
              updateSpiviPrivacySettings={props.updateSpiviPrivacySettings}
            />
          </div>
        )}
      {props.is_referral_program_activated && props.referralLink && (
        <>
          <div className={classes.separator} />
          <MemberReferralPanel
            maxReferralUses={maxReferralUses}
            nbRemainingReferralUses={nbRemainingReferralUses}
            referralLink={referralLink}
          />
        </>
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

export default React.memo(MemberCRM);
