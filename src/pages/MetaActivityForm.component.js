import React, { Component } from 'react';
import { connect } from 'react-redux';

import MetaActivityForm from '../components/MetaActivityForm.component';
import api from '../api';

type Props = {};

export class MetaActivityFormPage extends Component<Props> {
  createMetaActivity = (metaActivityData) => {
    api.activity.addMetaActivity(metaActivityData);
  };

  render() {
    const { SCTs, associatedCoaches, establishments } = this.props;
    console.log(establishments);
    return (
      <MetaActivityForm
        coaches={associatedCoaches}
        establishments={establishments}
        SCTs={SCTs}
        onSubmit={this.createMetaActivity}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
  };
}
export default connect(mapStateToProps)(MetaActivityFormPage);
