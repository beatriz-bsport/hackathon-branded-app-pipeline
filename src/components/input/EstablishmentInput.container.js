// @flow
import React from 'react';
import { connect } from 'react-redux';

import EstablishmentInput from './EstablishmentInput.component';

type Props = {
  establishments: Array<Establishment>,
};

export function EstablishmentInputContained(props: Props) {
  return (
    <EstablishmentInput establishments={props.establishments} {...props} />
  );
}

function mapStateToProps(state) {
  return {
    establishments: state.establishment.all,
  };
}

export default connect(mapStateToProps)(EstablishmentInputContained);
