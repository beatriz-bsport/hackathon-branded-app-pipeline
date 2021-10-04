// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover';

import { createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/styles';

type Item = {
  id: number;
};

type OwnProps<T> = {
  items: Array<T>;
  helperText: string;
  selectedItems: Array<number>;
  onChange: (selectedItems: Array<number>) => void;
  renderItem: (item: T) => React.ReactNode;
  helperAllSelectedText: string;
  labelName: keyof T;
};

type Props<T> = OwnProps<T> & WithStyles<typeof styles>;

type State = {
  selectedItems: Array<number>;
  open: boolean;
  anchorEl: any;
};

export class CheckboxSelector<T extends Item> extends Component<
  Props<T>,
  State
> {
  constructor(props: Props<T>) {
    super(props);
    const selectedItems = props.selectedItems || [];
    this.state = {
      selectedItems,
      open: false,
      anchorEl: null,
    };
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (this.props.selectedItems !== prevProps.selectedItems) {
      const selectedItems = this.props.selectedItems || [];
      this.setState({
        selectedItems,
      });
    }
  }

  handleChange = (id: number) => {
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

  renderValue() {
    const { helperText, items, labelName } = this.props;
    const { selectedItems } = this.state;
    return selectedItems.length === 0
      ? helperText
      : selectedItems
          .map((id) => items.find((item) => item.id === id)[labelName])
          .join(', ');
  }

  render() {
    const { selectedItems } = this.state;
    const { classes } = this.props;
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
          <ArrowDropDownIcon className={classes.dropdownArrow} />
        </ListItem>
        <Popover
          open={this.state.open}
          onClose={() => {
            this.props.onChange(selectedItems);
            this.setState({
              open: false,
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
          className={classes.popover}
        >
          <div
            className={classes.popoverDiv}
            style={{
              maxHeight: '800px',
              overflow: 'auto',
            }}
          >
            {[...this.props.items].map((item) => (
              <MenuItem
                className={classes.menuItem}
                key={item.id}
                value={item.id}
                onClick={() => this.handleChange(item.id)}
              >
                {this.props.renderItem ? this.props.renderItem(item) : null}
                <Checkbox
                  checked={this.state.selectedItems.includes(item.id)}
                />
              </MenuItem>
            ))}
          </div>
        </Popover>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    menuItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
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
    listItemButton: { padding: '0px', margin: '0px' },
    selector: {
      paddingRight: theme.spacing(2),
    },
    listItemTextRoot: {
      paddingRight: '0px',
    },
    popover: { maxHeight: '1200px' },
    popoverDiv: {
      maxHeight: '800px',
      overflow: 'auto',
    },
    dropdownArrow: { color: '#757575' },
  });

export default compose(withStyles(styles))(CheckboxSelector);
