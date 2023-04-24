// @ts-nocheck
import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { OptionCallback } from '../../../../state/types';
import InfoGenericBox from '#components/box/InfoGenericBox.component';
import PaginatedSubscriptionList from '../PaginatedSubscriptionList.component';
import { Subscription } from '../../types';

const PAGINATED_LIST_SIZE = 5;

type Props = {
  displayTextInfo: boolean;
  fetchMembersBySubscription: (subscriptionList: Array<Subscription>) => void;
  fetchSubscriptionBulk: (
    subscriptionIdList: Array<number>,
    options: OptionCallback<Array<Subscription>>,
  ) => void;
  icon: React.ReactNode;
  subscriptionIdList: number[];
  subscriptionData: { [id: number]: Subscription };
  textInfo: string;
  title: string;
};

export const ContractPauseFormPaginatedSubscriptionList = (props: Props) => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const nbSubscriptions = props.subscriptionIdList?.length || 0;
  const listIdx = [
    (currentPage - 1) * PAGINATED_LIST_SIZE,
    Math.min(currentPage * PAGINATED_LIST_SIZE, nbSubscriptions),
  ];
  const onPageRequested = (page: number) => {
    setLoadingPage(true);
    props.fetchSubscriptionBulk(
      props.subscriptionIdList.slice(
        (page - 1) * PAGINATED_LIST_SIZE,
        Math.min(page * PAGINATED_LIST_SIZE, nbSubscriptions),
      ),
      {
        onSuccess: (subscriptionList: Array<Subscription>) => {
          setCurrentPage(page);
          setLoadingPage(false);
          props.fetchMembersBySubscription(subscriptionList);
        },
      },
    );
  };
  return (
    <React.Fragment>
      <div className={classes.header}>
        {!!props.icon && <div className={classes.headerIcon}>{props.icon}</div>}
        <Typography variant="h6">{props.title}</Typography>
      </div>
      {props.displayTextInfo && !!props.textInfo && (
        <div className={classes.informationBoxContainer}>
          <InfoGenericBox
            variantIcon="outlined"
            alignItems="center"
            content={props.textInfo}
            type="info"
            variant="contained"
            className={classes.informationBox}
          />
        </div>
      )}
      {props.subscriptionIdList?.length > 0 && (
        <PaginatedSubscriptionList
          items={props.subscriptionIdList
            .slice(listIdx[0], listIdx[1])
            .map(
              (subscriptionId: number) =>
                props.subscriptionData[subscriptionId],
            )}
          nbItems={nbSubscriptions}
          loading={loadingPage}
          page={currentPage}
          itemPerPage={PAGINATED_LIST_SIZE}
          onPageRequested={onPageRequested}
        />
      )}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  headerIcon: {
    marginRight: theme.spacing(1.5),
    color: theme.palette.action.active,
    display: 'flex',
    alignItems: 'center',
  },
  informationBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  informationBoxContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default ContractPauseFormPaginatedSubscriptionList;
