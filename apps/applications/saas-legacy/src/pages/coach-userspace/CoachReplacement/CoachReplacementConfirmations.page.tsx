import React, { useEffect, useMemo, useState } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import makeStyles from '@material-ui/core/styles/makeStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Pagination from '@material-ui/lab/Pagination';

import ActivitiesToReplaceTable from '#src/libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTable.component';

import {
  ReplacementDisplays,
  ReplacementRequestStatus,
  PAGE_SIZE,
} from '#src/libs/replacement-request/constants';
import { ReplacementRequestAPIData } from '#src/libs/replacement-request/types';
import { getMyAssociatedCoachProfile } from '#src/libs/associated-coach/selectors';
import {
  withEstablishment as groupWithEstablishment,
  getAssociatedEstablishmentGroup,
} from '#src/libs/establishment/selectors';
import {
  getAllReplacementRequests,
  withCompleteOffer,
} from '#src/libs/replacement-request/selectors';
import { fetchOfferBulk as fetchOfferBulkAction } from '#src/libs/offer/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#src/libs/establishment/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#src/libs/meta-activity/actions';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import {
  fetchAllReplacementRequests as fetchAllReplacementRequestsAction,
  markSubstituteAsUnavailable as markSubstituteAsUnavailableAction,
} from '#src/libs/replacement-request/actions';
import { RootState } from '../../../reducers';
import { WithHandlerType } from '../../../utils/types';
import ReplacementRequestReasonDialog from '#src/libs/replacement-request/components/dialogs/ReplacementRequestReasonDialog.component';
import { OptionCallback } from '../../../state/types';

type ConnectProps = ConnectedProps<typeof connector>;
type Props = ConnectProps & WithHandlerType<typeof handlers>;
const FIRST_PAGE_INDEX = 1;

export const CoachReplacementConfirmations: React.FC<Props> = (
  props: Props,
) => {
  const {
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    fetchConfirmedReplacementRequests,
    companyId,
    replacementRequestCount,
    replacementRequestPage,
    replacementRequestLoading,
    offerBulkLoading,
    establishmentGroupLoading,
    metaActivityLoading,
    establishmentLoading,
    companyTheme,
  } = props;
  const classes = useStyles();

  const [unavailableDialogOpen, setUnavailableDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );

  const { t } = useTranslation('replacement');

  useEffect(() => {
    fetchLevelList({
      company: companyId,
    });
    fetchActivitiesCompany(companyId);
    fetchAllEstablishmentGroup(companyId);
    fetchEstablishments({
      company: companyId,
      disabled: false,
    });
  }, [
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    companyId,
  ]);

  useEffect(
    () => fetchConfirmedReplacementRequests(FIRST_PAGE_INDEX),
    [fetchConfirmedReplacementRequests],
  );

  const totalPages = useMemo(
    () => Math.ceil(replacementRequestCount / PAGE_SIZE),
    [replacementRequestCount],
  );

  const isLoading = useMemo(
    () =>
      replacementRequestLoading ||
      establishmentGroupLoading ||
      metaActivityLoading ||
      establishmentLoading ||
      offerBulkLoading ||
      !companyTheme?.timezone_name,
    [
      replacementRequestLoading,
      establishmentGroupLoading,
      metaActivityLoading,
      establishmentLoading,
      offerBulkLoading,
      companyTheme,
    ],
  );

  return (
    <>
      <div className={classes.descriptionContainer}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <Typography className={classes.description} variant="body2">
          {t('confirmations.description')}
        </Typography>
      </div>
      <Paper className={classes.paperContainer} elevation={0}>
        <TableContainer>
          <ActivitiesToReplaceTable
            coach={props.coach}
            enableMultiLocalization={
              props.companyTheme.enable_multi_localization
            }
            establishmentGroups={props.establishmentGroupList}
            handleMarkSubstituteAsUnavailable={(requestId) => {
              setSelectedRequestId(requestId);
              setUnavailableDialogOpen(true);
            }}
            isLoading={isLoading}
            replacementDisplay={ReplacementDisplays.REPLACEMENT_DISPLAY_CONFIRM}
            replacementRequestList={props.replacementRequestList}
            timezoneName={companyTheme.timezone_name}
          />
        </TableContainer>
        {replacementRequestCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={totalPages}
            onChange={(ev, value) => fetchConfirmedReplacementRequests(value)}
            page={replacementRequestPage}
          />
        )}
      </Paper>
      <ReplacementRequestReasonDialog
        atLeastOneLateRequest={false}
        lateReplacementRequestStatus={null as any}
        nbLateRequestsLeft={0}
        nbSelectedOffers={1}
        onClose={() => {
          setUnavailableDialogOpen(false);
          setSelectedRequestId(null);
        }}
        onCloseAfterSuccess={() => {
          setUnavailableDialogOpen(false);
          setSelectedRequestId(null);
        }}
        onSubmit={(reason, options) => {
          if (selectedRequestId) {
            props.handleMarkSubstituteAsUnavailable(
              selectedRequestId,
              reason,
              options as unknown as OptionCallback,
            );
          }
        }}
        open={unavailableDialogOpen}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
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
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      padding: `${theme.spacing(2)}px 0`,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
}));

const connector = connect(
  (state: RootState) => ({
    companyTheme: state.theme.theme,
    companyId: state.theme.theme.company,
    coach: getMyAssociatedCoachProfile(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    replacementRequestList: withCompleteOffer(getAllReplacementRequests)(state),
    replacementRequestCount: state.replacementRequest.count,
    replacementRequestPage: state.replacementRequest.page,

    replacementRequestLoading: state.replacementRequest.loading,
    establishmentGroupLoading: state.establishment.establishmentGroup.loading,
    metaActivityLoading: state.metaActivity.loading,
    establishmentLoading: state.establishment.loading,
    offerBulkLoading: state.offer.bulk.loading,
  }),
  {
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchLevelList: fetchLevelListAction,
    fetchAllReplacementRequests: fetchAllReplacementRequestsAction,
    fetchOfferBulk: fetchOfferBulkAction,
    markSubstituteAsUnavailable: markSubstituteAsUnavailableAction,
  },
);

const handlers = {
  fetchConfirmedReplacementRequests:
    ({
      fetchAllReplacementRequests,
      fetchOfferBulk,
      companyId,
      coach,
    }: ConnectProps) =>
    (page: number) => {
      fetchAllReplacementRequests(
        {
          company: companyId,
          approved_coach: coach.id,
          status__in: [
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_TEACHER_FOUND,
          ],
          offer_is_in_the_past: false,
          page_size: PAGE_SIZE,
          page,
        },
        {
          onSuccess: (replacementRequestList: ReplacementRequestAPIData[]) => {
            const offerIds = replacementRequestList.map((rr) => rr.offer);
            fetchOfferBulk(offerIds);
          },
        },
      );
    },
  handleMarkSubstituteAsUnavailable:
    ({
      markSubstituteAsUnavailable,
      fetchAllReplacementRequests,
      fetchOfferBulk,
      companyId,
      coach,
      replacementRequestPage,
    }: ConnectProps) =>
    (
      replacementRequestId: number,
      reason: string,
      options?: OptionCallback,
    ) => {
      markSubstituteAsUnavailable(replacementRequestId, reason, {
        onSuccess: () => {
          options?.onSuccess?.();
          fetchAllReplacementRequests(
            {
              company: companyId,
              approved_coach: coach.id,
              status__in: [
                ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_TEACHER_FOUND,
              ],
              offer_is_in_the_past: false,
              page_size: PAGE_SIZE,
              page: replacementRequestPage,
            },
            {
              onSuccess: (
                replacementRequestList: ReplacementRequestAPIData[],
              ) => {
                const offerIds = replacementRequestList.map((rr) => rr.offer);
                fetchOfferBulk(offerIds);
              },
            },
          );
        },
        onError: options?.onError,
      });
    },
};

export default compose(
  connector,
  withHandlers(handlers),
)(CoachReplacementConfirmations);
