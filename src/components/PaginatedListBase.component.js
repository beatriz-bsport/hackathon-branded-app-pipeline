// @flow
import React, { PureComponent } from 'react';

import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  items: Array<*>,
  renderItem: (*, number, number) => *,
  renderEmpty?: () => void,
  listProps: {},
  itemPerPage: number,
  nbItems: number,
  unknownNbItems?: boolean,
  page: number,
  loading: ?boolean,
  onPageRequested: (page: number, pageSize: number) => void,

  t: TFunction,
  classes: Object,
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

  hasNext = () => {
    if (this.props.unknownNbItems) {
      return this.props.itemPerPage === this.props.items.length;
    }
    return this.props.page * this.props.itemPerPage < this.props.nbItems;
  };

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

  renderEmpty = () => {
    if (this.props.renderEmpty) {
      return this.props.renderEmpty();
    }
    return this.defaultRenderEmpty();
  };

  defaultRenderEmpty = () => {
    return (
      <React.Fragment>
        <div className={this.props.classes.emptyContainer}>
          <Typography color="textSecondary" variant="caption">
            {this.props.t('paginatedList.isEmpty')}
          </Typography>
        </div>
        <Divider />
      </React.Fragment>
    );
  };

  render() {
    return (
      <div>
        <List {...this.props.listProps}>
          {this.props.items.map((i, idx) =>
            this.props.renderItem(i, idx, this.props.page),
          )}
          {!this.props.loading && this.props.items.length === 0
            ? this.renderEmpty()
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
              {this.props.unknownNbItems
                ? this.props.page
                : `${this.props.page} / ${this.calcLastPage()}`}
            </Typography>
            <IconButton
              color="secondary"
              disabled={!this.hasNext()}
              onClick={this.goNext}
            >
              <ChevronRightIcon />
            </IconButton>
            {this.props.unknownNbItems ? null : (
              <IconButton
                color="secondary"
                disabled={this.props.page >= this.calcLastPage()}
                onClick={this.goLast}
              >
                <LastPageIcon />
              </IconButton>
            )}
          </div>
          {this.props.unknownNbItems ? (
            <div />
          ) : (
            <Typography
              inline
              variant="caption"
              color="textSecondary"
              style={{ paddingRight: 16 }}
            >
              {`${this.props.nbItems || 0} ${this.props.t('common.items')}`}
            </Typography>
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
});

export default withStyles(styles)(withNamespaces()(PaginatedList));
