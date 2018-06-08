import React, { Component } from 'react';

import { connect } from 'react-redux';
import _ from 'lodash';
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  withStyles,
} from '@material-ui/core';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: [],
    };
  }

  static defaultProps = {
    updateFilter: () => {},
  };

  handleChange = (event) => {
    this.setState({ names: event.target.value });
    this.props.updateFilter(this.state.names);
  };

  handleDelete = (value) => {
    this.setState({ names: this.state.names.filter((n) => n !== value) });
    this.props.updateFilter(this.state.names);
  };

  render() {
    const { classes, theme, names, filterName, keys } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="select-multiple-chip">{filterName}</InputLabel>
        <Select
          multiple
          value={this.state.names}
          onChange={this.handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip
                  key={keys.indexOf(value)}
                  label={value}
                  onDelete={() => this.handleDelete(value)}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={keys.indexOf(name)} value={name}>
              <Checkbox checked={this.state.names.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))})
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Filter);
