// @flow
import React, { Component } from 'react';

import { withStyles, Grid, TextField, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { formatAsDate } from '../../datetime';
import { Moment } from '../../i18n';

type Props = {
  editMode: ?boolean,
  autoFocus: ?boolean,
  note: {
    text: string,
    date: string,
    id: number,
  },
  onSubmit: (text: string) => void,
  onDelete: () => void,
  classes: Object,
};

type State = {
  editMode: boolean,
  text: string,
  date: ?Object,
};

export class MemberNote extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: props.editMode || false,
      text: props.note.text,
      date: props.note.date,
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.text);
    this.setState({ editMode: false });
  };

  handleDelete = () => {
    this.props.onDelete();
  };

  handleChange = (e: Object) => {
    this.setState({ text: e.target.value });
  };

  render() {
    const { autoFocus, classes } = this.props;
    const { text, editMode, date } = this.state;
    return (
      <Grid container direction="row" justify="space-between">
        <Grid item xs={8}>
          <TextField
            fullWidth
            disabled={!editMode}
            autoFocus={autoFocus}
            multiline
            value={text}
            variant="outlined"
            label={formatAsDate(date || Moment())}
            onChange={this.handleChange}
            inputProps={{ className: classes.text }}
          />
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            direction="column"
            spacing={16}
            alignItems="flex-end"
            wrap="nowrap"
          >
            <Grid item>
              {editMode ? (
                <IconButton onClick={this.onSubmit}>
                  <SaveIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    this.setState({ editMode: true });
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              )}
              <IconButton onClick={this.handleDelete}>
                <DeleteIcon color="secondary" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const styles = () => ({
  text: {
    color: '#000000',
  },
});

export default withStyles(styles)(MemberNote);
