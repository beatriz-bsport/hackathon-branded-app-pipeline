// @flow
import React, { PureComponent } from 'react';

import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

type Props = {
  items: Array<*>,
  renderItem: (*) => *,
  listProps: {},
  itemPerPage: number,
};

type State = {
  page: number,
};

export default class PaginatedList extends PureComponent<Props, State> {
  state = { page: 1 };

  static defaultProps = {
    items: [],
    itemPerPage: 10,
  };

  getCurrentPage = () => {
    const { page } = this.state;
    const { itemPerPage } = this.props;
    return this.props.items.slice((page - 1) * itemPerPage, page * itemPerPage);
  };

  hasNext = () =>
    this.state.page * this.props.itemPerPage < this.props.items.length;

  hasPrevious = () => this.state.page > 1;

  goNext = () => this.setState((prevState) => ({ page: prevState.page + 1 }));

  goPrev = () => this.setState((prevState) => ({ page: prevState.page - 1 }));

  render() {
    return (
      <div>
        <List {...this.props.listProps}>
          {this.getCurrentPage().map((i) => this.props.renderItem(i))}
        </List>
        <IconButton
          color="secondary"
          disabled={!this.hasPrevious()}
          onClick={this.goPrev}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          color="secondary"
          disabled={!this.hasNext()}
          onClick={this.goNext}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    );
  }
}
