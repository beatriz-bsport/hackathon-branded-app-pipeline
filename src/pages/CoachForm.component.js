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
};

const styles = (theme) => {
  return {
    error: {
      backgroundColor: theme.palette.error.dark,
    },
  };
};

export class CoachFormPage extends Component<Props, State> {
  state = { open: false, error: null };

  createCoach = async (data: *) => {
    try {
      const response = await api.coach.addCoach(data);

      if (!response || response.status !== 200) {
        return this.setState({
          error: 'Impossible de valider le formulaire',
        });
      }

      this.setState({ open: true });
      this.props.history.goBack();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <CoachForm onSubmit={this.createCoach} />;
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
