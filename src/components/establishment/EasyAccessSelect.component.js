// @flow

import React from 'react';

import { Grid, TextField, Button } from '@material-ui/core';
import Fuse from 'fuse.js';

import EditIcon from '@material-ui/icons/Edit';
import EasyAccessStack from './EasyAccessStack.component';

type Props = {
  value: number,
  easyAccesses: *[],
  onChange: (number) => void,
};

type State = {
  easyAccessID: number,
  searchText: string,
};

export class EasyAccessSelect extends React.Component<Props, State> {
  state = {
    easyAccessID: null,
    searchText: '',
  };

  constructor(props) {
    super(props);

    if (props.value) {
      this.state.easyAccessID = props.value;
    }

    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name'],
    };
    this.fuse = new Fuse(this.props.easyAccesses, options); // "list" is the item array
  }

  updateSearchText = (event) => {
    this.setState({ searchText: event.target.value });
  };

  getValues = () => {
    const suggestions = this.state.searchText
      ? this.fuse.search(this.state.searchText)
      : this.props.easyAccesses;
    return suggestions.slice(0, 10);
  };

  select = (easyAccess) => {
    this.setState({ easyAccessID: easyAccess && easyAccess.id, easyAccess });

    if (easyAccess) {
      this.props.onChange(easyAccess.id);
    }
  };

  render() {
    if (this.state.easyAccessID) {
      return (
        <div>
          <EasyAccessStack
            name={this.state.easyAccess.name}
            lines={this.state.easyAccess.lines}
          />
          <Button
            variant="fab"
            color="primary"
            aria-label="Edit"
            onClick={() => this.select(null)}
          >
            <EditIcon />
          </Button>
        </div>
      );
    }

    const values = this.getValues();

    return (
      <div>
        <TextField
          id="searchText"
          name="Easy Access"
          onChange={this.updateSearchText}
        />

        <Grid container spacing={16}>
          {values.map((v) => (
            <Grid
              key={v.id}
              item
              xs={12}
              sm={6}
              md={4}
              lg={2}
              onClick={() => this.select(v)}
            >
              <EasyAccessStack name={v.name} lines={v.lines} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default EasyAccessSelect;
