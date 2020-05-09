// @flow
import React from 'react';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { Provision } from '../types';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import ProvisionListItem from './ProvisionListItem.component';

type Props = {
  provisions: Array<Provision>,
  loading: boolean,
  nbItems: number,
  page: number,
  itemPerPage: number,
  onPageRequested: (page: number, pageSize: number) => void,

  classes: Object,
  t: TFunction,
};

export const ProvisionGraph = (props: Props) => (
  <PaginatedListBase
    listProps={{ disablePadding: true, dense: true }}
    items={props.provisions}
    nbItems={props.nbItems}
    loading={props.loading}
    page={props.page}
    itemPerPage={props.itemPerPage}
    onPageRequested={(page, pageSize) => props.onPageRequested(page, pageSize)}
    renderEmpty={() => (
      <div>
        <Typography
          className={props.classes.emptyContainer}
          variant="caption"
          color="textSecondary"
        >
          {props.t('provision.noProvisionHistory')}
        </Typography>
        <Divider />
      </div>
    )}
    renderItem={(p) => <ProvisionListItem key={p.id} provision={p} />}
  />
);

const styles = (theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['shop']),
)(ProvisionGraph);
