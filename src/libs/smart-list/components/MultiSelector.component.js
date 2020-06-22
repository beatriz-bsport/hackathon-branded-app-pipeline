// @flow

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';

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
import CircularProgress from '@material-ui/core/CircularProgress';

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
  renderItem: () => void,
  nameIdentifier: string,
  helperAllSelectedText: string,
  selectAll: boolean,
  fetchItems: () => void,
};

type State = {
  selectedItems: Array<number>,
  open: boolean,
  anchorEl: any,
  searchedItems: Array<any>,
  searchText: string,
};

export class MultipleSelect extends Component<Props, State> {
  constructor(props) {
    super(props);
    const selectedItems = props.selectedItems || [];
    this.state = {
      selectedItems,
      open: false,
      anchorEl: null,
      searchedItems:
        [...props.items].sort((item, _item) => {
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
        }) || [],
      searchText: null,
      itemsFetched: false,
      selectAll: props.selectAll || false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedItems !== prevProps.selectedItems) {
      const selectedItems = this.props.selectedItems || [];
      this.setState({
        selectedItems,
        searchedItems:
          [...this.props.items].sort((item, _item) => {
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
          }) || [],
      });
    }
    if (this.props.items !== prevProps.items) {
      this.setState((prevState) => ({
        searchedItems:
          [...this.props.items].sort((item, _item) => {
            if (
              prevState.selectedItems.includes(item.id) &&
              prevState.selectedItems.includes(_item.id)
            ) {
              return 0;
            }
            if (
              prevState.selectedItems.includes(item.id) &&
              !prevState.selectedItems.includes(_item.id)
            ) {
              return -1;
            }
            return 1;
          }) || [],
      }));
    }
    if (this.props.selectAll !== prevProps.selectAll) {
      this.setState({
        selectAll: this.props.selectAll,
      });
    }
  }

  handleChange = (id) => {
    this.setState({ selectAll: false });
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
    if (!this.state.open && !this.state.itemsFetched && this.props.fetchItems) {
      this.props.fetchItems.fetchAction();
      this.setState({ itemsFetched: true });
    }
    this.setState((state) => ({
      anchorEl: currentTarget,
      open: !state.open,
    }));
  };

  changeSearch = (ev) => {
    this.setState({
      searchText: ev.target.value.toLowerCase(),
      searchedItems: this.props.items.filter((item) =>
        item[this.props.nameIdentifier]
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

  renderValue() {
    if (this.state.selectAll) {
      return `${this.props.helperAllSelectedText}`;
    }
    if (this.state.selectedItems.length === 0) {
      return this.props.helperText;
    }
    if (this.state.selectedItems.length === 1) {
      const itemSelected = [...this.state.selectedItems].pop();
      return this.props.items &&
        this.props.items.find((item) => item.id === itemSelected)
        ? this.props.items.find((item) => item.id === itemSelected)[
            this.props.nameIdentifier
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
              <Typography variant="body2">{this.renderValue()}</Typography>
            }
          />
          <ArrowDropDownIcon style={{ color: '#757575' }} />
        </ListItem>
        <Popover
          open={this.state.open}
          onClose={() => {
            this.props.onChange(selectedItems, this.state.selectAll);
            this.setState({
              open: false,
              searchText: null,
              searchedItems: this.props.items,
            });
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
          style={{ maxHeight: '400px' }}
        >
          <div style={{ position: 'sticky', top: '0px' }}>
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
          </div>
          {this.props.fetchItems.loading ? (
            <div className={classes.loadingContainer}>
              <CircularProgress size={30} />
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              <MenuItem
                className={classes.menuItem}
                key="all"
                value="all"
                onClick={() =>
                  this.setState((prevState) => ({
                    selectAll: !prevState.selectAll,
                    selectedItems: this.props.items.map((item) => item.id),
                  }))
                }
              >
                <Typography variant="subtitle2">
                  {t('multiSelector.selectAll')}
                </Typography>
                <Checkbox checked={this.state.selectAll} />
              </MenuItem>
              <MenuItem
                className={classes.menuItem}
                key="nothing"
                value="nothing"
                onClick={() =>
                  this.setState(() => ({
                    selectAll: false,
                    selectedItems: [],
                  }))
                }
              >
                <Typography variant="subtitle2">
                  {t('multiSelector.selectNothing')}
                </Typography>
              </MenuItem>
              {[...this.state.searchedItems].map((item) => (
                <MenuItem
                  className={classes.menuItem}
                  key={item.id}
                  value={item.id}
                  onClick={() => this.handleChange(item.id)}
                >
                  {this.props.renderItem ? this.props.renderItem(item) : null}
                  <Checkbox
                    checked={
                      this.state.selectedItems.includes(item.id) ||
                      this.state.selectAll
                    }
                  />
                </MenuItem>
              ))}
            </div>
          )}
        </Popover>
      </div>
    );
  }
}

const styles = (theme) => ({
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  listItemTextRoot: {
    paddingRight: '0px',
  },
  selector: {
    paddingRight: theme.spacing(2),
  },
  textField: {
    padding: theme.spacing(1) / 8,
  },
  gutters: { paddingLeft: '0px' },
  searchBar: {
    padding: theme.spacing(1),
  },
  root: {
    paddingRight: '0px',
    paddingBottom: theme.spacing(1) / 4,
    paddingTop: theme.spacing(3) / 8,
    marginLeft: theme.spacing(1),
  },
  divider: { borderBottom: '1px solid #909090' },
  ListItemButton: { padding: '0px', margin: '0px' },
  searchIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['smartList']),
)(MultipleSelect);
