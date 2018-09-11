// @flow
import React from 'react';

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

type Props = {
  activities: *[],
};

export class ConsumerActivities extends React.Component<Props> {
  renderActivityRow = (activity: Object) => {
    const { name, date } = activity;
    console.log(activity);
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
