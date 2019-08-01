// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';

import type { ConsumerPaymentPackConsumerView } from '../../api/types';

type Props = {
  packs: Array<ConsumerPaymentPackConsumerView>,
  classes: Object,
  t: (x: string) => string,
};

export class ConsumerPacks extends React.Component<Props> {
  renderPackRow = (pack: ConsumerPaymentPackConsumerView) => {
    const { t } = this.props;
    const {
      id,
      used_credits,
      payment_pack,
      ending_date,
      bookings_this_week,
    } = pack;
    const {
      unlimited,
      max_bookings_per_week,
      name,
      company,
      credits,
    } = payment_pack;

    let creditsLeft = t('paymentPack.unlimitedCredits');
    if (!unlimited) {
      const numberOfCreditsLeft = credits - used_credits;
      creditsLeft = `${numberOfCreditsLeft} / ${credits}`;
    }
    const bookingsLeftThisWeek = `${bookings_this_week}/${max_bookings_per_week}`;

    return (
      <TableRow key={id}>
        <TableCell>{name}</TableCell>
        <TableCell>{company.name}</TableCell>
        <TableCell>{ending_date}</TableCell>
        <TableCell>{creditsLeft}</TableCell>
        <TableCell>
          {max_bookings_per_week
            ? bookingsLeftThisWeek
            : t('paymentPack.unlimitedCredits')}
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
      <Table>
        <Paper>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell>{t('consumer.company')}</TableCell>
              <TableCell>{t('paymentPack.validUntil')}</TableCell>
              <TableCell>{t('paymentPack.credits')}</TableCell>
              <TableCell>{t('paymentPack.bookingsLeftThisWeek')}</TableCell>
            </TableRow>
          </TableHead>
          {this.renderTableContent()}
        </Paper>
      </Table>
    );
  }
}

const styles = (theme) => ({
  emptyBody: {
    margin: theme.spacing.unit * 2,
  },
});

export default withNamespaces()(withStyles(styles)(ConsumerPacks));
