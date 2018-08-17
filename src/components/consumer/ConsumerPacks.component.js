import React from 'react';

import {
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

type Props = {
  packs: *[],
};

export class ConsumerPacks extends React.Component<Props> {
  renderPackRow = (pack) => {
    const { name, used_credits, deactivated_until, base } = pack;
    return (
      <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>{base.base_name}</TableCell>
        <TableCell>{base.company.name}</TableCell>
        <TableCell>{base.endingDate.format('DD MMM YYYY')}</TableCell>
        <TableCell>
          {base.credits - used_credits} / {base.credits}
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { packs } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Base name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Valid until</TableCell>
                  <TableCell>Credits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{packs.map(this.renderPackRow)}</TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default ConsumerPacks;
