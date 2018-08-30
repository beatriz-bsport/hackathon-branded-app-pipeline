import React from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { translate } from 'react-i18next';

type Props = {
  packs: *[],
};

export class ConsumerPacks extends React.Component<Props> {
  renderPackRow = (pack) => {
    const { t } = this.props;
    const { name, used_credits, deactivated_until, payment_pack } = pack;
    return (
      <TableRow>
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

  render() {
    const { packs, t } = this.props;
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
          <TableBody>{packs.map(this.renderPackRow)}</TableBody>
        </Table>
      </Paper>
    );
  }
}

export default translate()(ConsumerPacks);
