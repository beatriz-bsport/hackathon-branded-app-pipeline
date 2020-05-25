// @flow
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import MemberNote from './MemberNote.component';

import type { MemberNote as MemberNoteType } from '../types';

type Props = {
  notes: Array<MemberNoteType>,
  createOrUpdateNote: ({
    id: number,
    text: string,
    memberId: number,
    highlighted: boolean,
  }) => void,
  memberId: number,
  deleteNote: ({ noteId: number, memberId: number }) => void,
  t: TFunction,
  healthNotes: ?boolean,
  classes: Object,
};

type State = {
  newNote: boolean,
};

export class MemberNotePanel extends Component<Props, State> {
  state = {
    newNote: false,
  };

  handleNoteSubmit = (id: number, text: string, highlighted: boolean) => {
    this.props.createOrUpdateNote({
      id,
      text,
      memberId: this.props.memberId,
      highlighted,
    });
    if (id === null) {
      this.setState({ newNote: false });
    }
  };

  handleNoteDelete = (id: number) => {
    this.props.deleteNote({ noteId: id, memberId: this.props.memberId });
  };

  deleteNewNote = () => {
    this.setState({ newNote: false });
  };

  addNewNote = (event: SyntheticEvent<any>) => {
    event.stopPropagation();
    this.setState({
      newNote: true,
    });
  };

  render() {
    const { notes, t, classes } = this.props;
    const { newNote } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <Typography component="h2" variant="h6" className={classes.title}>
          {this.props.healthNotes ? t('note.healthNotes') : t('note.myNotes')}
        </Typography>
        <Divider />
        {newNote ? (
          <div className={classes.noteContainer}>
            <MemberNote
              editMode
              autoFocus
              onSubmit={(text, highlighted) =>
                this.handleNoteSubmit(null, text, highlighted)
              }
              onDelete={this.deleteNewNote}
              note={{ text: '' }}
            />
          </div>
        ) : null}
        {notes.length
          ? notes.map((note) => (
              <div className={classes.noteContainer} key={note.id}>
                <MemberNote
                  onSubmit={(text, highlighted) =>
                    this.handleNoteSubmit(note.id, text, highlighted)
                  }
                  onDelete={() => this.handleNoteDelete(note.id)}
                  note={note}
                  key={note.id}
                  date={note.date}
                />
              </div>
            ))
          : null}
        {notes.length === 0 && !newNote ? (
          <div className={classes.emptyMessage}>
            <Typography variant="caption" color="textSecondary">
              {t('note.noNoteSaved')}
            </Typography>
          </div>
        ) : null}
        <Button
          className={classes.addButton}
          variant="outlined"
          color="primary"
          onClick={this.addNewNote}
        >
          <AddIcon className={classes.leftIcon} />
          {t('note.addNote')}
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({
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
});

export default withTranslation(['member'])(withStyles(styles)(MemberNotePanel));
