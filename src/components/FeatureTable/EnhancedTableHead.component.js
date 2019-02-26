// @flow
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { withNamespaces } from 'react-i18next';

type Props = {
  onSelectAllClick: () => void,
  order: string,
  orderBy: string,
  numSelected: number,
  rowCount: number,
  columnData: Object,
  showCheckboxes: boolean,
  onRequestSort: (Object, string) => void,
  t: (x: string) => string,
};
class EnhancedTableHead extends React.Component<Props> {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  renderColumn = (column) => {
    const { orderBy, t, order } = this.props;
    if (column.sortable) {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          padding={column.disablePadding ? 'none' : 'default'}
          sortDirection={orderBy === column.id ? order : false}
        >
          <Tooltip
            title={t('common.sort')}
            placement={column.numeric ? 'bottom-end' : 'bottom-start'}
            enterDelay={300}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={order}
              onClick={this.createSortHandler(column.id)}
            >
              {column.label}
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      );
    }
    return (
      <TableCell
        key={column.id}
        align={column.align}
        padding={column.disablePadding ? 'none' : 'default'}
      >
        {column.label}
      </TableCell>
    );
  };

  render() {
    const {
      onSelectAllClick,
      numSelected,
      rowCount,
      columnData,
      showCheckboxes,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {showCheckboxes ? (
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          ) : null}
          {columnData.map((column) => this.renderColumn(column), this)}
        </TableRow>
      </TableHead>
    );
  }
}

export default withNamespaces()(EnhancedTableHead);
