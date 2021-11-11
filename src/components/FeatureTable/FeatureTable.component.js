// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import LinearProgress from '@material-ui/core/LinearProgress';
import memoize from 'memoize-one';
import EnhancedTableToolbar from './EnhancedTableToolbar.component';
import EnhancedTableHead from './EnhancedTableHead.component';

const isInf = memoize((dataType) => {
  switch (dataType) {
    case 'text':
      return (a, b) => String(a).toLowerCase() < String(b).toLowerCase();
    default:
      return (a, b) => a < b;
  }
});

function getSorting(order: string, orderBy: string, dataType) {
  return order === 'desc'
    ? (a, b) => (isInf(dataType)(b[orderBy], a[orderBy]) ? -1 : 1)
    : (a, b) => (isInf(dataType)(a[orderBy], b[orderBy]) ? -1 : 1);
}

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  table: {
    minWidth: 10,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

type Props = {
  t: TFunction,
  loading: ?boolean,
  data: any,
  classes: Object,
  renderRow: (Object, () => void, boolean) => Object,
  columnData: Object,
  title: string,
  selectionFeature: Object,
  showCheckboxes: boolean,
  order: 'asc' | 'desc',
  orderBy: string,
};

type State = {
  order: string,
  orderBy: string,
  selected: Array<*>,
  page: number,
  rowsPerPage: number,
};

class MemberTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      order: props.order || 'asc',
      orderBy: props.orderBy || 'name',
      selected: [],
      page: 0,
      rowsPerPage: 25,
    };
  }

  formatPagination = (from: number, to: number, count: number) => {
    const { t } = this.props;
    return `${from}-${to} ${t('pagination.outOf')} ${count}`;
  };

  handleRequestSort = (event, property, dataType) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy, dataType });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(() => ({
        selected: this.props.data.map((n) => n.id),
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  renderContent = () => {
    const { data, renderRow } = this.props;

    const { order, orderBy, dataType, rowsPerPage, page } = this.state;
    // prettier-ignore

    return data
      .sort(getSorting(order, orderBy, dataType))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((n) => {
        const isSelected = this.isSelected(n.id);
        return renderRow(n, this.handleClick, isSelected);
      });
    /*
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
      emptyRows > 0 && (
        <TableRow style={{ height: 49 * emptyRows }}>
          <TableCell colSpan={6}>
            {loading ? <CircularProgress /> : null}
          </TableCell>
        </TableRow>
      );
    }
    */
  };

  render() {
    const {
      t,
      data,
      classes,
      columnData,
      title,
      selectionFeature,
      showCheckboxes,
    } = this.props;

    const { order, orderBy, selected, rowsPerPage, page } = this.state;

    return (
      <Paper className={classes.root}>
        {title ? (
          <EnhancedTableToolbar
            numSelected={selected.length}
            title={title}
            selectionFeature={selectionFeature}
          />
        ) : null}
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              columnData={columnData}
              showCheckboxes={showCheckboxes}
              loading={this.props.loading}
            />
            <TableBody>{this.renderContent()}</TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage={t('pagination.rowPerPage')}
          labelDisplayedRows={
            // eslint-disable-next-line
            ({ from, to, count }) => this.formatPagination(from, to, count)
          }
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {this.props.loading ? (
          <LinearProgress style={{ width: '100%' }} />
        ) : null}
      </Paper>
    );
  }
}

export default withStyles(styles)(withTranslation()(MemberTable));
