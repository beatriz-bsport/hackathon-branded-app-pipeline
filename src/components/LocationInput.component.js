// @flow

import React from 'react';
import { TextField } from '@material-ui/core';

import Map from './Map.component';

type Props = {};
type State = {};

export class LocationInput extends React.Component<Props, State> {
  state = {
    address: '',
  };

  constructor(props) {
    super(props);

    Object.keys(props.value || {}).forEach((key) => {
      this.state[key] = props.value[key];
    });
  }

  change = (event) => {
    const change = { [event.target.id]: event.target.value };
    this.setState(change);

    this.props.onChange(
      Object.assign(
        {
          id: this.state.id,
          address: this.state.address,
        },
        change,
      ),
    );
  };

  render() {
    return (
      <div>
        <TextField
          id="address"
          label="Adresse"
          value={this.state.address}
          type="text"
          onChange={this.change}
        />
        <Map />
      </div>
    );
  }
}

export default LocationInput;
