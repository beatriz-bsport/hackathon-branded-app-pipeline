// @flow
import React, { Component } from 'react';
import { TextField } from '@material-ui/core';

import Map from '../establishment/Map.component';

type Props = {
  value: Object,
  onChange: (Object) => void,
};

type State = {
  id: ?number,
  address: string,
};

export class LocationInput extends Component<Props, State> {
  state = {
    id: null,
    address: '',
  };

  constructor(props: Props) {
    super(props);

    Object.keys(props.value || {}).forEach((key) => {
      this.state[key] = props.value[key];
    });
  }

  change = (event: Object) => {
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
