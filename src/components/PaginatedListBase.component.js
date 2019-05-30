// @flow
import React, { PureComponent } from 'react';

import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  items: Array<*>,
  renderItem: (*) => *,
  renderEmpty?: () => void,
  listProps: {},
  itemPerPage: number,
  nbItems: number,
  page: number,
  loading: ?boolean,
  onPageRequested: (page: number, pageSize: number) => void,
  t: TFunction,
};

type State = {
  page: number,
};

export class PaginatedList extends PureComponent<Props, State> {
  static defaultProps = {
    items: [],
    itemPerPage: 10,
  };

  handlePageRequested = (page: number) => {
    this.props.onPageRequested(page, this.props.itemPerPage);
  };

  componentDidMount() {
    this.handlePageRequested(1);
  }

  hasNext = () => this.props.page * this.props.itemPerPage < this.props.nbItems;

  hasPrevious = () => this.props.page > 1;

  goNext = () => {
    this.handlePageRequested(this.props.page + 1);
  };

  calcLastPage = () => {
    if (this.props.nbItems && this.props.itemPerPage) {
      return Math.ceil(this.props.nbItems / this.props.itemPerPage);
    }
    return 1;
  };

  goPrev = () => this.handlePageRequested(this.props.page - 1);

  goFirst = () => this.handlePageRequested(1);

  goLast = () => this.handlePageRequested(this.calcLastPage());

  render() {
    return (
      <div>
        <List {...this.props.listProps}>
          {this.props.items.map((i) => this.props.renderItem(i))}
          {!this.props.loading &&
          this.props.items.length === 0 &&
          this.props.renderEmpty
            ? this.props.renderEmpty()
            : null}
        </List>
        {this.props.loading ? <LinearProgress /> : null}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <div>
            <IconButton
              color="secondary"
              disabled={!this.hasPrevious()}
              onClick={this.goFirst}
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              color="secondary"
              disabled={!this.hasPrevious()}
              onClick={this.goPrev}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography inline variant="caption">
              {`${this.props.page} / ${this.calcLastPage()}`}
            </Typography>
            <IconButton
              color="secondary"
              disabled={!this.hasNext()}
              onClick={this.goNext}
            >
              <ChevronRightIcon />
            </IconButton>
            <IconButton
              color="secondary"
              disabled={this.props.page >= this.calcLastPage()}
              onClick={this.goLast}
            >
              <LastPageIcon />
            </IconButton>
          </div>
          <Typography
            inline
            variant="caption"
            color="textSecondary"
            style={{ paddingRight: 16 }}
          >
            {`${this.props.nbItems || 0} ${this.props.t('common.items')}`}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(PaginatedList);
