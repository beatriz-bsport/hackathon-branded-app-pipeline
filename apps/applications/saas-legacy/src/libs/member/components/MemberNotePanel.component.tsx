import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core';
// @ts-expect-error
import MemberNote from './MemberNote.component';

import type { MemberNote as MemberNoteType } from '../types';

type Props = {
  notes: Array<MemberNoteType>;
  createOrUpdateNote: ({
    id,
    text,
    memberId,
    highlighted,
  }: {
    id: number;
    text: string;
    memberId: number;
    highlighted: boolean;
  }) => void;
  memberId: number;
  deleteNote: ({
    noteId,
    memberId,
  }: {
    noteId: number;
    memberId: number;
  }) => void;
  healthNotes?: boolean;
};

const MemberNotePanel: React.FC<Props> = ({
  createOrUpdateNote,
  deleteNote,
  healthNotes,
  memberId,
  notes,
}) => {
  const [isNewNote, setIsNewNote] = React.useState(false);
  const { t } = useTranslation('member');
  const classes = useStyles();

  const handleNoteSubmit = React.useCallback(
    (id: number, text: string, highlighted: boolean) => {
      createOrUpdateNote({
        id,
        text,
        memberId,
        highlighted,
      });
      if (id === null) {
        setIsNewNote(false);
      }
    },
    [createOrUpdateNote, memberId],
  );

  const handleNoteDelete = React.useCallback(
    (id: number) => {
      deleteNote({ noteId: id, memberId });
    },
    [deleteNote, memberId],
  );

  const deleteNewNote = React.useCallback(() => setIsNewNote(false), []);

  const addNewNote = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setIsNewNote(true);
    },
    [],
  );

  return (
    <div id="member-notes" style={{ width: '100%' }}>
      <Typography className={classes.title} component="h2" variant="h6">
        {healthNotes ? t('note.healthNotes') : t('note.myNotes')}
      </Typography>
      <Divider />
      {isNewNote ? (
        <div className={classes.noteContainer}>
          <MemberNote
            autoFocus
            editMode
            note={{ text: '' }}
            onDelete={deleteNewNote}
            onSubmit={(text: string, highlighted: boolean) =>
              handleNoteSubmit(null, text, highlighted)
            }
          />
        </div>
      ) : null}
      {(notes ?? []).length
        ? notes.map((note) => (
            <div key={note.id} className={classes.noteContainer}>
              <MemberNote
                key={note.id}
                date={note.date}
                note={note}
                onDelete={() => handleNoteDelete(note.id)}
                onSubmit={(text: string, highlighted: boolean) =>
                  handleNoteSubmit(note.id, text, highlighted)
                }
              />
            </div>
          ))
        : null}
      {(notes ?? []).length === 0 && !isNewNote ? (
        <div className={classes.emptyMessage}>
          <Typography color="textSecondary" variant="caption">
            {t('note.noNoteSaved')}
          </Typography>
        </div>
      ) : null}
      <Button
        className={classes.addButton}
        color="primary"
        onClick={addNewNote}
        variant="outlined"
      >
        <AddIcon className={classes.leftIcon} />
        {t('note.addNote')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyMessage: {
    margin: theme.spacing(2),
    marginLeft: 0,
  },
  noteContainer: {
    paddingTop: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export default React.memo(MemberNotePanel);
