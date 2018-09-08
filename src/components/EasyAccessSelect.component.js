// @flow

import React from 'react';

import { Select, MenuItem } from '@material-ui/core';

type Props = {
  easyAccesses: *[],
  onChange: (number) => void,
};

type State = {
  easyAccessID: number,
};

export class EasyAccessSelect extends React.Component<Props, State> {
  state = {
    easyAccessID: null,
  };

  constructor(props) {
    super(props);

    if (props.value) {
      this.state.easyAccessID = props.value;
    }
  }

  handleChange = (event) => {
    console.log(event.target);
    const { value } = event.target;
    this.setState({ easyAccessID: value });

    this.props.onChange(value);
  };

  render() {
    console.log(this.props.easyAccesses);
    return (
      <Select
        value={this.state.easyAccessID}
        onChange={this.handleChange}
        inputProps={{
          name: 'easy_access',
          id: 'easy-access',
        }}
      >
        {this.props.easyAccesses.map((easyAccess) => (
          <MenuItem key={easyAccess.id} value={easyAccess.id}>
            {easyAccess.name}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default EasyAccessSelect;
