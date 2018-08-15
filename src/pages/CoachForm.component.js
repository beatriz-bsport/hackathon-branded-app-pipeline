import _ from 'lodash';
import React, { Component } from 'react';

import CoachForm from '../components/CoachForm.component';

import api from '../api';

export class CoachFormPage extends Component<{}> {
  createCoach = (data) => {
    api.coach.addCoach(data);
  };

  render() {
    return <CoachForm onSubmit={this.createCoach} />;
  }
}

export default CoachFormPage;
