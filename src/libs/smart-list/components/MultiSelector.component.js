// @flow

import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';

import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import DelayedTextField from '../../../components/DelayedTextField.component';

type Props = {
  classes: Object,
  t: TFunction,
  items: Array<any>,
  helperText: string,
  textFieldPlaceholder: string,
  helperSelectedText: string,
  selectedItems: Array<number>,
  onChange: () => void,
  primaryTextIdentifier: string,
  secondaryTextIdentifier: string,
};

type State = {
  selectedItems: Array<number>,
  open: boolean,
  anchorEl: any,
  searchedItems: Array<any>,
  searchText: string,
};

export class MultipleSelect extends Component<Props, State> {
  state = {
    selectedItems: this.props.selectedItems || [],
    open: false,
    anchorEl: null,
    searchedItems: this.props.items || [],
    searchText: null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedItems !== prevProps.selectedItems) {
      this.setState({
        selectedItems: this.props.selectedItems || [],
      });
    }
    if (this.props.items !== prevProps.items) {
      this.setState({
        searchedItems: this.props.items || [],
      });
    }
  }

  handleChange = (id) => {
    if (this.state.selectedItems.includes(id)) {
      this.setState((prevState) => ({
        selectedItems: prevState.selectedItems.filter((item) => item !== id),
      }));
    } else {
      this.setState((prevState) => ({
        selectedItems: [...prevState.selectedItems, id],
      }));
    }
  };

  handleClick = (event) => {
    const { currentTarget } = event;
    this.setState((state) => ({
      anchorEl: currentTarget,
      open: !state.open,
    }));
  };

  changeSearch = (ev) => {
    this.setState({
      searchText: ev.target.value.toLowerCase(),
      searchedItems: this.props.items.filter((item) =>
        item[this.props.primaryTextIdentifier]
          .toLowerCase()
          .includes(ev.target.value.toLowerCase()),
      ),
    });
  };

  clearSearch = () => {
    this.setState({
      searchText: null,
      searchedItems: this.props.items,
    });
  };

  selectAll = () => {
    if (this.state.selectedItems.length === this.props.items.length) {
      this.setState({ selectedItems: [] });
    } else {
      this.setState({ selectedItems: this.props.items.map((item) => item.id) });
    }
  };

  renderValue() {
    if (this.state.selectedItems.length === 0) {
      return this.props.helperText;
    }
    if (this.state.selectedItems.length === 1) {
      const itemSelected = [...this.state.selectedItems].pop();
      return this.props.items.find((item) => item.id === itemSelected)
        ? this.props.items.find((item) => item.id === itemSelected)[
            this.props.primaryTextIdentifier
          ]
        : ' - ';
    }
    return `${this.state.selectedItems.length} ${this.props.helperSelectedText}`;
  }

  render() {
    const { selectedItems } = this.state;
    const { classes, t } = this.props;
    return (
      <div className={classes.selector}>
        <ListItem
          classes={{
            gutters: classes.gutters,
            button: classes.listItemButton,
            root: classes.root,
            divider: classes.divider,
          }}
          button
          divider
          onClick={this.handleClick}
        >
          <ListItemText
            classes={{
              root: classes.listItemTextRoot,
            }}
            primary={
              <Typography variant="body1">{this.renderValue()}</Typography>
            }
          />
          <ArrowDropDownIcon style={{ color: '#757575' }} />
        </ListItem>
        <Popover
          open={this.state.open}
          onClose={() => {
            this.props.onChange(selectedItems);
            this.setState({ open: false });
          }}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          style={{ maxHeight: '300px' }}
        >
          <DelayedTextField
            placeholder={this.props.textFieldPlaceholder}
            value={this.state.searchText || ''}
            fullWidth
            variant="outlined"
            onChange={this.changeSearch}
            delay={170}
            autoFocus
            className={classes.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: this.state.searchText ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      this.state.searchText ? 'Clear search' : 'Search'
                    }
                    onClick={this.clearSearch}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <MenuItem key="all" value="all" onClick={() => this.selectAll()}>
            <Checkbox
              checked={
                this.state.selectedItems.length === this.props.items.length
              }
            />
            <ListItemText primary={t('multiSelector.selectAll')} />
          </MenuItem>
          {[...this.state.searchedItems]
            .sort((item, _item) => {
              if (
                selectedItems.includes(item.id) &&
                selectedItems.includes(_item.id)
              ) {
                return 0;
              }
              if (
                selectedItems.includes(item.id) &&
                !selectedItems.includes(_item.id)
              ) {
                return -1;
              }
              return 1;
            })
            .map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                onClick={() => this.handleChange(item.id)}
              >
                <Checkbox
                  checked={this.state.selectedItems.includes(item.id)}
                />
                <ListItemText
                  primary={item[this.props.primaryTextIdentifier]}
                  secondary={
                    this.props.secondaryTextIdentifier
                      ? item[this.props.secondaryTextIdentifier]
                      : null
                  }
                />
              </MenuItem>
            ))}
        </Popover>
      </div>
    );
  }
}

const styles = (theme) => ({
  listItemTextRoot: {
    paddingRight: '0px',
  },
  selector: {
    paddingRight: theme.spacing.unit * 2,
  },
  textField: {
    padding: '1px',
  },
  gutters: { paddingLeft: '0px' },
  searchBar: {
    padding: theme.spacing.unit,
  },
  root: {
    paddingRight: '0px',
    paddingBottom: '2px',
    paddingTop: '3px',
    marginLeft: theme.spacing.unit,
  },
  divider: { borderBottom: '1px solid #909090' },
  ListItemButton: { padding: '0px', margin: '0px' },
  searchIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['smartList']),
)(MultipleSelect);
