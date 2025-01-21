// @flow
import React, { Component } from 'react';
import { DateTime } from 'luxon';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import type { MemberNote as MemberNoteType } from '../types';

type Props = {
  editMode?: boolean,
  autoFocus?: boolean,
  note: MemberNoteType,
  onSubmit: (text: string, highlighted: boolean) => void,
  onDelete: () => void,
  classes: Object,
};

type State = {
  editMode: boolean,
  text: string,
  date?: Object,
  highlighted: boolean,
};

export class MemberNote extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: props.editMode || false,
      text: props.note.text,
      date: props.note.date,
      highlighted: props.note.highlighted,
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.text, this.state.highlighted);
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
    const { text, editMode, date, highlighted } = this.state;
    return (
      <Grid container direction="row" justify="space-between">
        <Grid item xs={8}>
          <TextField
            fullWidth
            multiline
            autoFocus={autoFocus}
            disabled={!editMode}
            inputProps={{ className: classes.text }}
            label={(date
              ? DateTime.fromISO(date)
              : DateTime.now()
            ).toLocaleString()}
            onChange={this.handleChange}
            value={text}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            alignItems="flex-end"
            direction="column"
            spacing={2}
            wrap="nowrap"
          >
            <Grid item>
              {editMode ? (
                <React.Fragment>
                  <Checkbox
                    checked={highlighted}
                    checkedIcon={<VisibilityOn />}
                    icon={<VisibilityOff />}
                    onChange={(e, checked) =>
                      this.setState({ highlighted: checked })
                    }
                  />
                  <IconButton onClick={this.onSubmit}>
                    <SaveIcon color="primary" />
                  </IconButton>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <IconButton
                    onClick={() =>
                      this.setState(
                        (prevState) => ({
                          highlighted: !prevState.highlighted,
                        }),
                        this.onSubmit,
                      )
                    }
                  >
                    {highlighted ? (
                      <VisibilityOn color="secondary" />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                  {(!this.props.note || this.props.note.editable) && (
                    <IconButton
                      onClick={() => {
                        this.setState({ editMode: true });
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  )}
                </React.Fragment>
              )}
              {(!this.props.note || this.props.note.editable) && (
                <IconButton onClick={this.handleDelete}>
                  <DeleteIcon color="secondary" />
                </IconButton>
              )}
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
