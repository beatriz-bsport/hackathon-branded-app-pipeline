import React from 'react';
import { fakerEN as faker } from '@faker-js/faker'; // TEMP IMPORT
import { DateTime } from 'luxon';

import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TabPanel from '@material-ui/lab/TabPanel';

import ReceiptIcon from '@material-ui/icons/Receipt';

import type { ShopItemHistoryTableRow } from '../types';

import { SHOPITEM_PER_PAGE } from '#libs/shop/constants';
import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';

type TableRowItemProps = {
  item: ShopItemHistoryTableRow;
};

const TEMP_HISTORY_TABLE_DATA = faker.helpers.multiple(
  () => ({
    id: faker.number.int(10000),
    date: DateTime.now().toFormat('yyyy-MM-dd HH:mm ZZZ'),
    variant: `${faker.helpers.arrayElement([
      'Black',
      'Blue',
      'Red',
      'Yellow',
      'Green',
    ])} - ${faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL'])}`,
    studio: 'YogaZen - Paris',
    updateType: faker.helpers.arrayElement([
      'Sale',
      'Manual adjustment',
      'Purchase order',
    ]),
    quantity: faker.number.int({ min: 2, max: 25 }),
    invoiceURL: faker.internet.url(),
  }),
  { count: SHOPITEM_PER_PAGE },
);

const TableRowItem: React.FC<TableRowItemProps> = ({ item }) => {
  const { t } = useTranslation('shop');
  const emptyFn = () => {};

  return (
    <TableRow key={item.variant}>
      <TableCell>{item.date}</TableCell>
      <TableCell>{item.variant}</TableCell>
      <TableCell>{item.studio}</TableCell>
      <TableCell>{item.updateType}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>
        <Button
          size="small"
          startIcon={<ReceiptIcon />}
          variant="outlined"
          onClick={emptyFn}
        >
          {t('shopItemDetail.table.history.invoice.seeInvoice')}
        </Button>
      </TableCell>
    </TableRow>
  );
};

const ShopItemDetailHistoryTab: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation('shop');

  return (
    <TabPanel
      className={classes.tabPanelContainer}
      value={ShopItemDetailTab.HISTORY}
    >
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('shopItemDetail.table.history.date')}</TableCell>
              <TableCell>{t('shopItemDetail.table.history.variant')}</TableCell>
              <TableCell>{t('shopItemDetail.table.history.studio')}</TableCell>
              <TableCell>
                {t('shopItemDetail.table.history.updateType.title')}
              </TableCell>
              <TableCell>
                {t('shopItemDetail.table.history.quantity')}
              </TableCell>
              <TableCell>
                {t('shopItemDetail.table.history.invoice.title')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TEMP_HISTORY_TABLE_DATA.map((row) => (
              <TableRowItem item={row} key={row.id}></TableRowItem>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination className={classes.justifyCenter} count={1} />
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  tabPanelContainer: {
    padding: theme.spacing(2),
  },
  tableContainer: {
    paddingBottom: theme.spacing(2),
  },
  tableEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  tablePagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default React.memo(ShopItemDetailHistoryTab);
