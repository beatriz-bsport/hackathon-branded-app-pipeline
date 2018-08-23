import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { translate } from 'react-i18next';

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 10,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

export class PaymentTable extends Component<{}> {
  render() {
    const { t, data, classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>ID</CustomTableCell>
              <CustomTableCell>{t('payment.consumer')}</CustomTableCell>
              <CustomTableCell>{t('payment.type')}</CustomTableCell>
              <CustomTableCell numeric>{t('payment.amount')}</CustomTableCell>
              <CustomTableCell numeric>
                {t('payment.paymentDate')}
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n) => (
              <TableRow className={classes.row} key={n.id}>
                <CustomTableCell component="th" scope="row">
                  {n.id.slice(0, 8).toUpperCase()}
                </CustomTableCell>
                <CustomTableCell>{n.name}</CustomTableCell>
                <CustomTableCell>{n.kind}</CustomTableCell>
                <CustomTableCell numeric>{n.price}</CustomTableCell>
                <CustomTableCell numeric>{n.date}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
export default withStyles(styles)(translate()(PaymentTable));
