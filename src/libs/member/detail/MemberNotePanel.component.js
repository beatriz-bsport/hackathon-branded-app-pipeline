// @flow
import React from 'react';
import {
  Divider,
  Grid,
  Typography,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import MemberNote from '../../../components/member/MemberNote.component';

import type { Member } from '../../../api/types';

type Props = {
  newNote: ?boolean,
  expanded: boolean,
  member: Member,

  onChange: (*, boolean) => void,
  handleNoteSubmit: (*, string) => void,
  deleteNewNote: () => void,
  addNewNote: () => void,

  t: TFunction,
  classes: Object,
};

export function MemberNotePanel(props: Props) {
  const {
    newNote,
    member,
    addNewNote,
    deleteNewNote,
    handleNoteSubmit,
    expanded,
    onChange,
    t,
    classes,
  } = props;
  const notes = member.notes || [];
  return (
    <ExpansionPanel expanded={expanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography className={classes.headingExpansionPanel}>
              {`${t('member.showNotes')} (${notes.length})`}
            </Typography>
          </Grid>
          <Grid item>
            <Button onClick={addNewNote} color="primary">
              <AddIcon className={classes.iconLeft} />
              {t('common.add')}
            </Button>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ padding: 0 }}>
        <div style={{ width: '100%' }}>
          <Divider />
          {newNote ? (
            <div className={classes.noteContainer}>
              <MemberNote
                editMode
                autoFocus
                onSubmit={(text) => handleNoteSubmit(null, text)}
                onDelete={deleteNewNote}
                note={newNote}
              />
            </div>
          ) : null}
          {notes.length ? (
            notes.map((note) => (
              <div className={classes.noteContainer} key={note.id}>
                <MemberNote
                  onSubmit={(text) => handleNoteSubmit(note.id, text)}
                  onDelete={() => this.handleNoteDelete(note.id)}
                  note={note}
                  key={note.id}
                  date={note.date}
                />
              </div>
            ))
          ) : (
            <Typography variant="caption" className={classes.emptyMessage}>
              {t('member.noNoteSaved')}
            </Typography>
          )}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

const styles = (theme) => ({
  emptyMessage: {
    margin: theme.spacing.unit * 3,
  },
  noteContainer: {
    padding: theme.spacing.unit * 2,
  },
  headingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
});

export default translate()(withStyles(styles)(MemberNotePanel));
