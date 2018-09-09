import React from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  Typography,
} from '@material-ui/core';
import { translate } from 'react-i18next';

type Props = {
  packs: *[],
};

export class ConsumerPacks extends React.Component<Props> {
  renderPackRow = (pack) => {
    const { t } = this.props;
    const { id, name, used_credits, deactivated_until, payment_pack } = pack;
    return (
      <TableRow key={id}>
        <TableCell>{payment_pack.name}</TableCell>
        <TableCell>{payment_pack.company.name}</TableCell>
        <TableCell>{payment_pack.ending_date || ' - '}</TableCell>
        <TableCell>
          {payment_pack.unlimited
            ? t('paymentPack.unlimitedCredits')
            : `${payment_pack.credits - used_credits} / ${
                payment_pack.credits
              }`}
        </TableCell>
      </TableRow>
    );
  };

  renderTableContent = () => {
    const { t, packs, classes } = this.props;
    if (packs.length > 0) {
      return <TableBody>{packs.map(this.renderPackRow)}</TableBody>;
    }

    return (
      <TableBody>
        <Typography className={classes.emptyBody} variant="caption">
          {t('paymentPack.noPaymentPackSubscribed')}
        </Typography>
      </TableBody>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell>{t('consumer.company')}</TableCell>
              <TableCell>{t('paymentPack.validUntil')}</TableCell>
              <TableCell>{t('paymentPack.credits')}</TableCell>
            </TableRow>
          </TableHead>
          {this.renderTableContent()}
        </Table>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  emptyBody: {
    margin: theme.spacing.unit * 2,
  },
});

export default translate()(withStyles(styles)(ConsumerPacks));
