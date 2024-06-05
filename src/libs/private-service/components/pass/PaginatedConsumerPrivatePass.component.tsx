import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
// @ts-expect-error
import { Member } from '#libs/member/types';
import PaginatedListBase from '../../../../components/PaginatedListBase.component';
import { PrivateConsumerPass } from '../../types';
import PrivateConsumerPassBookerListItem from '../booking-module/PrivateConsumerPassBookerListItem.component';
import { OptionCallback } from '../../../../state/types';

type Props = {
  onClick?: (
    PrivateConsumerPass: PrivateConsumerPass<Member<number, number>>,
  ) => void;
  allowedFranchisees?: Array<number>;
  items: Array<PrivateConsumerPass>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  updatePrivateConsumerPassCredits?: (
    id: number,
    credits: -1 | 1,
    options: OptionCallback,
  ) => void;
};

export const PaginatedConsumerPrivatePass = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['privateService']);
  return (
    <div>
      <PaginatedListBase
        itemPerPage={props.itemPerPage}
        items={props.items}
        listProps={{ disablePadding: 'true', dense: 'true' }}
        loading={props.loading}
        nbItems={props.nbItems}
        onPageRequested={(page: number, pageSize: number) =>
          props.onPageRequested(page, pageSize)
        }
        page={props.page}
        renderEmpty={() => (
          <div>
            <Typography
              className={classes.emptyContainer}
              color="textSecondary"
              variant="caption"
            >
              {t('noPrivateConsumerPass')}
            </Typography>
            <Divider />
          </div>
        )}
        renderItem={(pcp: PrivateConsumerPass<Member<number, number>>) => (
          // @ts-expect-error
          <PrivateConsumerPassBookerListItem
            key={pcp.id}
            divider
            showMember
            disabled={
              props.allowedFranchisees?.length &&
              !props.allowedFranchisees.includes(pcp.private_pass?.company)
            }
            onClick={props.onClick ? () => props.onClick(pcp) : null}
            onUpdateCredit={props.updatePrivateConsumerPassCredits}
            private_consumer_pass={pcp}
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
