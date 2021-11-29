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
import { withTranslation, TFunction } from 'react-i18next';
import { createData } from '../../../components/analytics/Analytics';

type Props = {
  open: boolean,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
};

const rows = createData();

function createSpecs(props, row) {
  const specs = row.analyticSpec.map((e) =>
    e.specs.length ? (
      <TableCell className={props.classes.cellsBorder}>
        <div align="left">
          <b>params: {'{'}</b>
        </div>
        {e.specs.map((s) => {
          return (
            <div style={{ marginLeft: '15px' }}>
              <b>{s[0]}</b>: {s[1]}
            </div>
          );
        })}
        <div>
          <b>{'}'}</b>
        </div>
      </TableCell>
    ) : (
      <TableCell className={props.classes.cellsBorder} />
    ),
  );
  return (
    <TableRow>
      <TableCell className={props.classes.cellsBorder} />
      {specs}
    </TableRow>
  );
}

function createBody(props) {
  const body = [];
  rows.forEach((row) => {
    const events = row.analyticSpec.map((e) => (
      <TableCell className={props.classes.cellsBorder} align="left">
        {e.label || '----------'}
      </TableCell>
    ));
    body.push(
      <TableRow>
        <TableCell
          className={props.classes.cellsBorder}
          component="th"
          scope="row"
        >
          {props.t(`analytics.${row.description}`)}
        </TableCell>
        {events}
      </TableRow>,
    );
    body.push(createSpecs(props, row));
  });
  return body;
}

const AnalyticsDialog = (props: Props) => {
  const body = createBody(props);
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
              <TableCell className={props.classes.cellsBorder} align="left">
                {props.t('analytics.gtmEvent')}
              </TableCell>
              <TableCell align="left">
                {props.t('analytics.fbPixelEvent')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{body}</TableBody>
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
