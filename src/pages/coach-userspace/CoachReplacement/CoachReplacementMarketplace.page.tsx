import React, { useEffect, useState, useMemo } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import uniq from 'lodash/uniq';

import makeStyles from '@material-ui/core/styles/makeStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Pagination from '@material-ui/lab/Pagination';

import ActivitiesToReplaceTable from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTable.component';
import EstablishmentsSelector from '#libs/establishment/components/EstablishmentSelector.component';
import EstablishmentGroupSelector from '#libs/establishment/components/EstablishmentGroupSelector.component';
// @ts-expect-error
import MetaActivitySelector from '#libs/meta-activity/components/MetaActivitySelector.component';

import {
  ReplacementDisplays,
  ReplacementRequestStatus,
  ReplacementRequestCoachAnswerStatus,
  PAGE_SIZE,
} from '#libs/replacement-request/constants';
import { ReplacementRequestAPIData } from '#libs/replacement-request/types';
import { RootState } from '../../../reducers';
import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import {
  withEstablishment as groupWithEstablishment,
  getAssociatedEstablishmentGroup,
  getAvailableEstablishmentList,
} from '#libs/establishment/selectors';
import { getEnabledMetaActivities } from '#libs/meta-activity/selectors';
import {
  getAllReplacementRequests,
  withCompleteOffer,
  withCoachAnswers,
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
  fetchAllReplacementRequestCoachAnswers as fetchAllReplacementRequestCoachAnswersAction,
  createOrUpdateReplacementRequestCoachAnswer as createOrUpdateReplacementRequestCoachAnswerAction,
} from '#libs/replacement-request/actions';
import { WithHandlerType } from '../../../utils/types';

type ConnectProps = ConnectedProps<typeof connector>;
type Props = ConnectProps & WithHandlerType<typeof handlers>;

type FilterProps = {
  metaActivities: number[];
  establishments: number[];
  establishmentGroups: number[];
};

export const CoachReplacement: React.FC<Props> = (props: Props) => {
  const {
    fetchAssociatedCoachesList,
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    companyId,
    fetchCompatibleReplacementRequests,
    replacementRequestPage,
    replacementRequestCount,
    replacementRequestLoading,
    offerBulkLoading,
    coachLoading,
    metaActivityLoading,
    establishmentLoading,
    establishmentGroupLoading,
    coachAnswerLoading,
    createOrUpdateAnswer,
    companyTheme,
  } = props;

  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const isLoading = useMemo(
    () =>
      replacementRequestLoading ||
      offerBulkLoading ||
      coachLoading ||
      metaActivityLoading ||
      establishmentLoading ||
      coachAnswerLoading ||
      establishmentGroupLoading ||
      !companyTheme?.timezone_name,
    [
      replacementRequestLoading,
      offerBulkLoading,
      coachLoading,
      metaActivityLoading,
      establishmentLoading,
      establishmentGroupLoading,
      coachAnswerLoading,
      companyTheme,
    ],
  );

  const replacementRequestsTotalPages = useMemo(
    () =>
      (replacementRequestCount / PAGE_SIZE) % 1 === 0
        ? replacementRequestCount / PAGE_SIZE
        : Math.floor(replacementRequestCount / PAGE_SIZE) + 1,
    [replacementRequestCount],
  );

  const [filters, setFilters] = useState<FilterProps>({
    metaActivities: [],
    establishments: [],
    establishmentGroups: [],
  });

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
      // @ts-expect-error
      diabled: false,
    });
  }, [
    fetchAssociatedCoachesList,
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    companyId,
  ]);

  useEffect(
    () => fetchCompatibleReplacementRequests(1, filters),
    [fetchCompatibleReplacementRequests, filters],
  );

  // @ts-expect-error
  const handleFilterSelect = (filterName: string) => (ev) =>
    // @ts-expect-error
    setFilters({ ...filters, [filterName]: ev.map((e) => e.value) });

  return (
    <>
      <div className={classes.descriptionContainer}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <Typography className={classes.description} variant="body2">
          {t('marketplace.description')}
        </Typography>
      </div>

      <div className={classes.filtersContainer}>
        <Typography className={classes.filterTitle} variant="button">
          {t('marketplace.filters')}
        </Typography>
        <div className={classes.filters}>
          <MetaActivitySelector
            isLoading={metaActivityLoading}
            metaActivities={props.metaActivityList}
            selectedMetaActivities={filters.metaActivities}
            selectOption={handleFilterSelect('metaActivities')}
          />
        </div>
        <div className={classes.filters}>
          <EstablishmentsSelector
            closeMenuOnSelect={false}
            establishments={props.establishmentList}
            isLoading={establishmentLoading}
            noMulti={false}
            selectedEstablishments={filters.establishments}
            selectOption={handleFilterSelect('establishments')}
          />
        </div>
        {props.companyTheme.enable_multi_localization && (
          <div className={classes.filters}>
            <EstablishmentGroupSelector
              closeMenuOnSelect={false}
              establishmentGroups={props.establishmentGroupList}
              isLoading={establishmentGroupLoading}
              noMulti={false}
              selectedEstablishmentGroups={filters.establishmentGroups}
              selectOption={handleFilterSelect('establishmentGroups')}
            />
          </div>
        )}
      </div>
      <Paper className={classes.paperContainer} elevation={0}>
        <TableContainer>
          <ActivitiesToReplaceTable
            coach={props.coach}
            enableMultiLocalization={
              props.companyTheme.enable_multi_localization
            }
            establishmentGroups={props.establishmentGroupList}
            handleCoachAnswer={createOrUpdateAnswer}
            isLoading={isLoading}
            replacementDisplay={
              ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE
            }
            replacementRequestList={props.replacementRequestList}
            timezoneName={companyTheme.timezone_name}
          />
        </TableContainer>
        {replacementRequestCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={replacementRequestsTotalPages}
            onChange={(ev, value) =>
              fetchCompatibleReplacementRequests(value, filters)
            }
            // fetch requested page on page change
            page={replacementRequestPage}
          />
        )}
      </Paper>
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
    marginBottom: theme.spacing(1),
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
  filtersContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      columnGap: theme.spacing(2),
      rowGap: theme.spacing(1),
      gridTemplateColumns: '1fr 1fr',
    },
  },
  filterTitle: {
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / 3',
    },
  },
  filters: {
    display: 'table',
    width: '17%',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      width: 'unset',
      justifySelf: 'stretch',
    },
  },
  paperContainer: {
    margin: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      padding: `${theme.spacing(2)}px 0`,
    },
  },
}));

const connector = connect(
  (state: RootState) => ({
    companyTheme: state.theme.theme,
    companyId: state.theme.theme.company,
    replacementRequestList: withCoachAnswers(
      withCompleteOffer(getAllReplacementRequests),
    )(state),
    loading: state.replacementRequest.loading,
    coach: getMyAssociatedCoachProfile(state),
    metaActivityList: getEnabledMetaActivities(state),
    establishmentList: getAvailableEstablishmentList(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    replacementRequestCount: state.replacementRequest.count,
    replacementRequestPage: state.replacementRequest.page,

    replacementRequestLoading: state.replacementRequest.loading,
    offerBulkLoading: state.offer.bulk.loading,
    coachLoading: state.coach.loading,
    metaActivityLoading: state.metaActivity.loading,
    establishmentLoading: state.establishment.loading,
    establishmentGroupLoading: state.establishment.establishmentGroup.loading,
    coachAnswerLoading:
      state.replacementRequest.replacementRequestCoachAnswer.loading,
  }),
  {
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchLevelList: fetchLevelListAction,
    fetchAllReplacementRequests: fetchAllReplacementRequestsAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchOfferBulk: fetchOfferBulkAction,
    fetchAllReplacementRequestCoachAnswers:
      fetchAllReplacementRequestCoachAnswersAction,
    createOrUpdateReplacementRequestCoachAnswer:
      createOrUpdateReplacementRequestCoachAnswerAction,
  },
);

const handlers = {
  fetchCompatibleReplacementRequests:
    ({
      fetchAllReplacementRequests,
      companyId,
      fetchOfferBulk,
      fetchAllReplacementRequestCoachAnswers,
      coach,
    }: ConnectProps) =>
    (page: number, filters: FilterProps) => {
      const sanitizedFilters = {
        ...(filters.metaActivities?.length > 0
          ? { meta_activity__in: filters.metaActivities }
          : {}),
        ...(filters.establishments?.length > 0
          ? { establishment__in: filters.establishments }
          : {}),
        ...(filters.establishmentGroups?.length > 0
          ? { establishment_group__in: filters.establishmentGroups }
          : {}),
      };

      fetchAllReplacementRequests(
        {
          ...sanitizedFilters,
          company: companyId,
          status__in: [
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS,
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS,
          ],
          closing_date_exceeded: false,
          me: false,
          offer_available: true,
          page_size: PAGE_SIZE,
          page,
        },
        {
          onSuccess: (replacementRequestList: ReplacementRequestAPIData[]) => {
            const offerIds = replacementRequestList.map((rr) => rr.offer);
            const replacementRequestAnswersIds = uniq(
              replacementRequestList.reduce(
                (acc, request) => acc.concat(request.coach_answer),
                [],
              ),
            );
            fetchOfferBulk(offerIds);
            fetchAllReplacementRequestCoachAnswers({
              id__in: replacementRequestAnswersIds,
              company: companyId,
              coach: coach.id,
            });
          },
        },
      );
    },
  createOrUpdateAnswer:
    ({
      createOrUpdateReplacementRequestCoachAnswer,
      fetchAllReplacementRequestCoachAnswers,
      coach,
      companyId,
    }: ConnectProps) =>
    (
      answer: ReplacementRequestCoachAnswerStatus,
      replacementRequestId: number,
    ) => {
      createOrUpdateReplacementRequestCoachAnswer(
        replacementRequestId,
        {
          coach: coach.id,
          company: companyId,
          replacement_request: replacementRequestId,
          answer,
        },
        {
          onSuccess: (replacementRequest: ReplacementRequestAPIData) => {
            const replacementRequestAnswerIds =
              replacementRequest.coach_answer || [];
            if (replacementRequestAnswerIds.length) {
              fetchAllReplacementRequestCoachAnswers({
                id__in: replacementRequestAnswerIds,
                company: companyId,
                coach: coach.id,
              });
            }
          },
        },
      );
    },
};

export default compose(connector, withHandlers(handlers))(CoachReplacement);
