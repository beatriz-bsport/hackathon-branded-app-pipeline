// @flow
import React, { Component } from 'react';

import { Grid, TextField, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

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
};

type State = {
  editMode: boolean,
  text: string,
};

export default class MemberNote extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: props.editMode || false,
      text: props.note.text,
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
    const { autoFocus } = this.props;
    const { text, editMode } = this.state;
    return (
      <Grid container direction="row" justify="space-between">
        <Grid item xs={10}>
          <TextField
            fullWidth
            disabled={!editMode}
            autoFocus={autoFocus}
            multiline
            value={text}
            variant="outlined"
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="column" spacing={16} alignItems="flex-end">
            <Grid item>
              {editMode ? (
                <IconButton>
                  <SaveIcon color="primary" onClick={this.onSubmit} />
                </IconButton>
              ) : (
                <IconButton>
                  <EditIcon
                    color="primary"
                    onClick={() => this.setState({ editMode: true })}
                  />
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
