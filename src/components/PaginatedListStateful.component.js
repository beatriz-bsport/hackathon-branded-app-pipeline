// @flow
import React, { PureComponent } from 'react';

import PaginatedListBase from './PaginatedListBase.component';

type Props = {
  items: Array<any>,
  renderItem: (any, number, number) => any,
  listProps: {},
  loading: ?boolean,
  itemPerPage: number,
};

type State = {
  page: number,
};

export default class PaginatedList extends PureComponent<Props, State> {
  state = { page: 1 };

  handlePageRequested = (page: number) => {
    this.setState({ page });
  };

  getCurrentPage = () => {
    const { itemPerPage } = this.props;
    const { page } = this.state;
    return this.props.items.slice((page - 1) * itemPerPage, page * itemPerPage);
  };

  render() {
    return (
      <PaginatedListBase
        {...this.props}
        items={this.getCurrentPage()}
        page={this.state.page}
        nbItems={(this.props.items || []).length}
        onPageRequested={this.handlePageRequested}
      />
    );
  }
}
