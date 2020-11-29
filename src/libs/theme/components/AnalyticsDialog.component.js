// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DialogActions from '@material-ui/core/DialogActions';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  open: boolean,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
};

function createData(description, googleEventName, facebookEventName) {
  return { description, googleEventName, facebookEventName };
}

const rows = [
  createData('showBasket', 'bsport:basket:show', ''),
  createData('showPass', 'bsport:pass:show', ''),
  createData('addPassToCart', 'bsport:basket:add-to-cart:pass', 'AddToCart'),
  createData('addPackToCart', 'bsport:basket:add-to-cart:pack', 'AddToCart'),
  createData(
    'addPrivatePassToCart',
    'bsport:basket:add-to-cart:private-pass',
    'AddToCart',
  ),
  createData(
    'addShopItemToCart',
    'bsport:basket:add-to-cart:shop-item',
    'AddToCart',
  ),
  createData('paymentSuccess', 'bsport:basket:payment-success', 'Purchase'),
  createData('signinShow', 'bsport:signin:show', ''),
  createData('signupShow', 'bsport:signup:show', ''),
  createData('signupSuccess', 'bsport:signup:success', 'CompleteRegistration'),
  createData('Lorsque l"utilisateur se connecte', 'bsport:signin:success', ''),
  createData('sessionShow', 'bsport:calendar:session-show', ''),
  createData('contractPaymentSuccess', 'bsport:contract:payment-success', ''),
  createData('contractShow', 'bsport:contract:show', ''),
  createData('contractPaymentShow', 'bsport:contract:show-payment', ''),
  createData('workshopClick', 'bsport:workshop-click', ''),
];

const AnalyticsDialog = (props: Props) => {
  return (
    <Dialog
      fullScreen={false}
      open={props.open}
      classes={{ paperWidthSm: props.classes.paperWidthSm }}
    >
      <DialogContent>
        <Table className={props.classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={props.classes.cellsBorder}>
                {props.t('analytics.eventDesc')}
              </TableCell>
              <TableCell className={props.classes.cellsBorder} align="right">
                {props.t('analytics.gtmEvent')}
              </TableCell>
              <TableCell align="right">
                {props.t('analytics.fbPixelEvent')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell
                  className={props.classes.cellsBorder}
                  component="th"
                  scope="row"
                >
                  {props.t(`analytics.${row.description}`)}
                </TableCell>
                <TableCell className={props.classes.cellsBorder} align="right">
                  {row.googleEventName}
                </TableCell>
                <TableCell align="right">
                  {row.facebookEventName || '----------'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onCancel} variant="contained" color="primary">
          {props.t('analytics.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = (theme) => ({
  paperWidthSm: {
    maxWidth: 900,
  },
  table: {
    [theme.breakpoints.down('xl')]: {
      width: 800,
    },
    [theme.breakpoints.down('lg')]: {
      width: 700,
    },
    [theme.breakpoints.down('md')]: {
      width: 600,
    },
    [theme.breakpoints.down('sm')]: {
      width: 500,
    },
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
  },
  cellsBorder: {
    borderColor: 'rgba(224, 224, 224, 1)',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'solid',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['theme']),
)(AnalyticsDialog);
