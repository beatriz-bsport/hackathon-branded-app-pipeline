// @ts-nocheck
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Pagination from '@material-ui/lab/Pagination';
import ReplacementRequestDeleteDialog from '#libs/replacement-request/components/dialogs/ReplacementRequestDeleteDialog.component';

import ActivitiesToReplaceTable from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTable.component';

import {
  ReplacementDisplays,
  ReplacementRequestStatus,
  PAGE_SIZE,
  ReplacementRequestPaginationByStatus,
} from '#libs/replacement-request/constants';
import { ReplacementRequestAPIData } from '#libs/replacement-request/types';
import { RootState } from '../../../reducers';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';

import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import {
  withEstablishment as groupWithEstablishment,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';
import {
  withCompleteOffer,
  getAllPendingReplacementRequestsSpecificPagination,
  getAllTeacherFoundReplacementRequestsSpecificPagination,
} from '#libs/replacement-request/selectors';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#libs/associated-coach/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#libs/meta-activity/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import {
  fetchAllReplacementRequests as fetchAllReplacementRequestsAction,
  cancelReplacementRequest as cancelReplacementRequestAction,
  fetchHasUnseenConfirmedRequests as fetchHasUnseenConfirmedRequestsAction,
  markConfirmedRequestsAsSeen as markConfirmedRequestsAsSeenAction,
} from '#libs/replacement-request/actions';
import { WithHandlerType } from '../../../utils/types';
import { updateReplacementRequestLastSeen as updateReplacementRequestLastSeenAPI } from '#libs/replacement-request/api';

type ConnectProps = ConnectedProps<typeof connector>;
type Props = ConnectProps & WithHandlerType<typeof handlers>;

export const CochReplacementRequests: React.FC<Props> = (props: Props) => {
  const {
    fetchAssociatedCoachesList,
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    companyId,
    pendingReplacementRequestList,
    teacherFoundReplacementRequestList,
    fetchMyPendingRequests,
    fetchMyTeacherFoundRequests,
    pendingRequestsCount,
    pendingRequestsPage,
    teacherFoundRequestsCount,
    teacherFoundRequestsPage,
    replacementRequestLoading,
    offerBulkLoading,
    coachLoading,
    metaActivityLoading,
    establishmentLoading,
    cancelReplacementRequest,
    fetchHasUnseenConfirmedRequests,
    hasUnseenConfirmedRequests,
    markConfirmedRequestsAsSeen,
    replacementRequestUpdateLoading,
    companyTheme,
  } = props;

  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleCloseDialog = useCallback(() => setSelectedRequest(null), []);

  const onClickDelete = useCallback(
    (replacementRequestId: number) => setSelectedRequest(replacementRequestId),
    [],
  );

  const handleConfirm = useCallback(
    () =>
      cancelReplacementRequest(selectedRequest, {
        onSuccess: () => {
          fetchMyPendingRequests(pendingRequestsPage);
          setSelectedRequest(null);
        },
      }),
    [
      cancelReplacementRequest,
      selectedRequest,
      fetchMyPendingRequests,
      pendingRequestsPage,
    ],
  );

  const pendingRequestsTotalPages = useMemo(
    () => Math.ceil(pendingRequestsCount / PAGE_SIZE),
    [pendingRequestsCount],
  );

  const teacherFoundRequestsTotalPages = useMemo(
    () => Math.ceil(teacherFoundRequestsCount / PAGE_SIZE),
    [teacherFoundRequestsCount],
  );

  const isLoading = useMemo(
    () =>
      replacementRequestLoading ||
      offerBulkLoading ||
      coachLoading ||
      establishmentLoading ||
      metaActivityLoading ||
      !companyTheme.timezone_name,
    [
      replacementRequestLoading,
      offerBulkLoading,
      coachLoading,
      establishmentLoading,
      metaActivityLoading,
      companyTheme,
    ],
  );

  useEffect(() => {
    fetchAssociatedCoachesList({
      company: companyId,
      disabled: false,
    });
    fetchLevelList({
      company: companyId,
    });
    fetchActivitiesCompany(companyId);
    fetchAllEstablishmentGroup(companyId);
    fetchEstablishments({
      company: companyId,
      disabled: false,
    });
    fetchHasUnseenConfirmedRequests({ company: companyId });
  }, [
    fetchAssociatedCoachesList,
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    fetchHasUnseenConfirmedRequests,
    companyId,
  ]);

  useEffect(() => {
    fetchMyPendingRequests(1);
    fetchMyTeacherFoundRequests(1);
  }, [fetchMyPendingRequests, fetchMyTeacherFoundRequests]);

  const [showReplacedRequests, setShowReplacedRequests] = useState(false);
  const onToggleCollapse = () => {
    const prevValue = showReplacedRequests;
    setShowReplacedRequests(!prevValue);
    if (!prevValue && hasUnseenConfirmedRequests) {
      markConfirmedRequestsAsSeen();
      updateReplacementRequestLastSeenAPI({ company: companyId }).catch(
        (error) => console.error(error),
      );
    }
  };

  return (
    <>
      <div className={classes.descriptionContainer}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <Typography className={classes.description} variant="body2">
          {t('requests.description')}
        </Typography>
      </div>
      <Paper className={classes.paperContainer} elevation={0}>
        <Typography
          variant="h5"
          component="h2"
          className={classNames(
            classes.buttonTitle,
            classes.buttonTitleMarginBottom,
          )}
        >
          {t('requestTableTitles.pending')}
        </Typography>
        <TableContainer>
          <ActivitiesToReplaceTable
            coach={props.coach}
            enableMultiLocalization={companyTheme.enable_multi_localization}
            replacementDisplay={
              ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING
            }
            replacementRequestList={pendingReplacementRequestList}
            establishmentGroups={props.establishmentGroupList}
            handleDeleteAction={onClickDelete}
            isLoading={isLoading}
            timezoneName={companyTheme.timezone_name}
          />
        </TableContainer>
        {pendingRequestsCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={pendingRequestsTotalPages}
            page={pendingRequestsPage}
            // fetch requested page on page change
            onChange={(ev, value) => fetchMyPendingRequests(value)}
          />
        )}
      </Paper>
      <Paper className={classes.paperContainer} elevation={0}>
        <ButtonBase
          className={classNames(classes.buttonTitle, {
            [classes.buttonTitleMarginBottom]: showReplacedRequests,
          })}
          onClick={onToggleCollapse}
        >
          {showReplacedRequests ? (
            <ExpandLessIcon className={classes.expandButton} />
          ) : (
            <ExpandMoreIcon className={classes.expandButton} />
          )}
          <div className={classes.flex}>
            <Typography variant="h5" component="h2">
              {t('requestTableTitles.replacementFound')}
            </Typography>
            {hasUnseenConfirmedRequests && <div className={classes.redChip} />}
          </div>
        </ButtonBase>
        <Collapse in={showReplacedRequests}>
          <TableContainer>
            <ActivitiesToReplaceTable
              coach={props.coach}
              enableMultiLocalization={companyTheme.enable_multi_localization}
              replacementDisplay={
                ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_TEACHER_FOUND
              }
              replacementRequestList={teacherFoundReplacementRequestList}
              establishmentGroups={props.establishmentGroupList}
              isLoading={isLoading}
              timezoneName={companyTheme.timezone_name}
            />
          </TableContainer>
          {teacherFoundRequestsCount > 0 && (
            <Pagination
              className={classes.pagination}
              count={teacherFoundRequestsTotalPages}
              page={teacherFoundRequestsPage}
              // fetch requested page on page change
              onChange={(ev, value) => fetchMyTeacherFoundRequests(value)}
            />
          )}
        </Collapse>
      </Paper>
      {!!selectedRequest && (
        <ReplacementRequestDeleteDialog
          open={!!selectedRequest}
          onClose={handleCloseDialog}
          onConfirm={handleConfirm}
          updateLoading={replacementRequestUpdateLoading}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  flex: { display: 'flex', alignItems: 'center' },
  redChip: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
    marginLeft: theme.spacing(2),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  descriptionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(4)}px`,
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
  },
  description: {
    color: chroma(theme.palette.info.dark).darken(1.5).hex(),
  },
  infoIcon: {
    color: theme.palette.info.main,
    marginRight: theme.spacing(1),
  },
  paperContainer: {
    margin: theme.spacing(3),
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1),
      padding: `${theme.spacing(2)}px 0`,
    },
  },
  buttonTitle: {
    color: theme.palette.grey[500],
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(2),
    },
  },
  buttonTitleMarginBottom: { marginBottom: theme.spacing(3) },
  expandButton: { marginRight: theme.spacing(1) },
}));

const connector = connect(
  (state: RootState) => ({
    companyTheme: state.theme.theme,
    companyId: state.theme.theme.company,
    pendingReplacementRequestList: withCompleteOffer(
      getAllPendingReplacementRequestsSpecificPagination,
    )(state),
    teacherFoundReplacementRequestList: withCompleteOffer(
      getAllTeacherFoundReplacementRequestsSpecificPagination,
    )(state),
    pendingRequestsPage: state.replacementRequest.pendingRequests.page,
    pendingRequestsCount: state.replacementRequest.pendingRequests.count,
    teacherFoundRequestsPage:
      state.replacementRequest.teacherFoundRequests.page,
    teacherFoundRequestsCount:
      state.replacementRequest.teacherFoundRequests.count,

    replacementRequestUpdateLoading:
      state.replacementRequest.updateRequest.loading,
    replacementRequestLoading:
      state.replacementRequest.pendingRequests.loading ||
      state.replacementRequest.teacherFoundRequests.loading,
    offerBulkLoading: state.offer.bulk.loading,
    coachLoading: state.coach.loading,
    metaActivityLoading: state.metaActivity.loading,
    establishmentLoading: state.establishment.loading,

    coach: getMyAssociatedCoachProfile(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    page: state.replacementRequest.page,
    count: state.replacementRequest.count,
    hasUnseenConfirmedRequests:
      state.replacementRequest.teacherFoundRequests.hasUnseen,
  }),
  {
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchLevelList: fetchLevelListAction,
    fetchAllReplacementRequests: fetchAllReplacementRequestsAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchOfferBulk: fetchOfferBulkAction,
    cancelReplacementRequest: cancelReplacementRequestAction,
    fetchHasUnseenConfirmedRequests: fetchHasUnseenConfirmedRequestsAction,
    markConfirmedRequestsAsSeen: markConfirmedRequestsAsSeenAction,
  },
);

const handlers = {
  fetchMyPendingRequests:
    ({
      coach,
      fetchAllReplacementRequests,
      fetchOfferBulk,
      companyId,
    }: ConnectProps) =>
    (page: number) => {
      const params = {
        company: companyId,
        coach: coach.id,
        status__in: [
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS,
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS,
        ],
        offer_is_in_the_past: false,
        page_size: PAGE_SIZE,
        page,
      };
      fetchAllReplacementRequests(
        params,
        {
          onSuccess: (replacementRequestList: ReplacementRequestAPIData[]) => {
            const offerIds = replacementRequestList.map((rr) => rr.offer);
            fetchOfferBulk(offerIds);
          },
        },
        ReplacementRequestPaginationByStatus.Pending,
      );
    },
  fetchMyTeacherFoundRequests:
    ({
      coach,
      fetchAllReplacementRequests,
      fetchOfferBulk,
      companyId,
    }: ConnectProps) =>
    (page: number) => {
      const params = {
        company: companyId,
        coach: coach.id,
        status__in: [
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_TEACHER_FOUND,
        ],
        offer_is_in_the_past: false,
        page_size: PAGE_SIZE,
        page,
      };
      fetchAllReplacementRequests(
        params,
        {
          onSuccess: (replacementRequestList: ReplacementRequestAPIData[]) => {
            const offerIds = replacementRequestList.map((rr) => rr.offer);
            fetchOfferBulk(offerIds);
          },
        },
        ReplacementRequestPaginationByStatus.TeacherFound,
      );
    },
};

export default compose(
  connector,
  withHandlers(handlers),
)(CochReplacementRequests);
