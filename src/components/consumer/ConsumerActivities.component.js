// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

type Props = {
  activities: *[],
};

export class ConsumerActivities extends React.Component<Props> {
  renderActivityRow = (activity: Object) => {
    const { name, date } = activity;
    return (
      <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>{date.format('DD MMM YYYY')}</TableCell>
      </TableRow>
    );
  };

  render() {
    const { activities } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{activities.map(this.renderActivityRow)}</TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default ConsumerActivities;
