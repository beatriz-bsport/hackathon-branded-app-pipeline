// @flow

import React from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import VodMemberGenericListItem from './VodMemberGenericListItem.component';
import type { VideoView, VideoPurchase } from '../types';

type Props = {
  items: Array<any>,
  nbItems: number,
  loading: boolean,
  page: number,
  itemPerPage: number,
  onClick: (item: VideoView | VideoPurchase) => void,
  onPageRequested: (page: number, pageSize: number) => void,
  emptyText: string,
  renderSecondaryText: (item: VideoView | VideoPurchase) => string,
  classes: Object,
};

export const PaginatedVideoViewList = (props: Props) => {
  return (
    <PaginatedListBase
      listProps={{ disablePadding: 'true', dense: 'true' }}
      items={props.items}
      nbItems={props.nbItems}
      loading={props.loading}
      page={props.page}
      itemPerPage={props.itemPerPage}
      onPageRequested={(page, pageSize) =>
        props.onPageRequested(page, pageSize)
      }
      renderEmpty={() => (
        <>
          <div className={props.classes.emptyContainer}>
            <Typography variant="caption" color="textSecondary">
              {props.emptyText}
            </Typography>
          </div>
          <Divider />
        </>
      )}
      renderItem={(item) => (
        <VodMemberGenericListItem
          key={item.id}
          item={item}
          onClick={() => props.onClick(item)}
          secondaryText={props.renderSecondaryText(item)}
        />
      )}
    />
  );
};

const styles = (theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
});

export default compose(withStyles(styles))(PaginatedVideoViewList);
