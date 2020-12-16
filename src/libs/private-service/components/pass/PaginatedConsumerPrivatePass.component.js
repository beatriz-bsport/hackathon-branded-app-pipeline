// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import PaginatedListBase from '../../../../components/PaginatedListBase.component';
import { PrivateConsumerPass } from '../../types.ts';
import PrivateConsumerPassBookerListItem from '../booking-module/PrivateConsumerPassBookerListItem.component';

type Props = {
  onClick: ?(ConsumerPaymentPack) => void,
  items: Array<PrivateConsumerPass>,
  nbItems: number,
  loading: boolean,
  page: number,
  itemPerPage: number,
  onPageRequested: (id: number, page: number, pageSize: number) => void,
  updatePrivateConsumerPassCredits: (...any) => void,
};

export const PaginatedConsumerPrivatePass = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['privateService']);
  return (
    <div>
      <PaginatedListBase
        listProps={{ disablePadding: 'true', dense: 'true' }}
        items={props.items}
        loading={props.loading}
        itemPerPage={props.itemPerPage}
        page={props.page}
        nbItems={props.nbItems}
        onPageRequested={(page, pageSize) =>
          props.onPageRequested(page, pageSize)
        }
        renderEmpty={() => (
          <div>
            <Typography
              className={classes.emptyContainer}
              variant="caption"
              color="textSecondary"
            >
              {t('noPrivateConsumerPass')}
            </Typography>
            <Divider />
          </div>
        )}
        renderItem={(pcp) => (
          <PrivateConsumerPassBookerListItem
            divider
            key={pcp.id}
            showMember
            private_consumer_pass={pcp}
            onUpdateCredit={props.updatePrivateConsumerPassCredits}
            onClick={props.onClick ? () => props.onClick(pcp) : null}
          />
        )}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
}));

export default PaginatedConsumerPrivatePass;
