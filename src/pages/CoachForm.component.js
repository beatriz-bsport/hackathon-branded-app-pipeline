// @flow

import React, { Component } from 'react';
import { withStyles, Snackbar } from '@material-ui/core';
import { withRouter } from 'react-router';

import CoachForm from '../components/form/CoachForm.component';

import api from '../api';

type Props = {
  history: Object,
};
type State = {
  open: boolean,
  error: ?string,
  processing: boolean,
};

const styles = (theme) => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
});

export class CoachFormPage extends Component<Props, State> {
  state = { open: false, error: null, processing: false };

  createCoach = async (data: *) => {
    this.setState({ processing: true });
    try {
      const response = await api.coach.addCoach(data);

      if (!response || response.status !== 200) {
        return this.setState({
          error: 'Impossible de valider le formulaire',
          processing: false,
        });
      }

      this.setState({
        open: true,
        processing: false,
      });
      this.props.history.goBack();
    } catch (e) {
      console.log(e);
      this.setState({
        processing: false,
      });
      throw e;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <CoachForm onSubmit={this.createCoach} processing={this.state.processing} />;
        <Snackbar open={this.state.open} message="Coach créé" />
        <Snackbar
          open={this.state.error}
          message={this.state.error}
          className={classes.error}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(CoachFormPage));
