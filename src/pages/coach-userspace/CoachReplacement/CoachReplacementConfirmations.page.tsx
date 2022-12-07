import React, { useEffect, useMemo } from 'react';
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

import ActivitiesToReplaceTable from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTable.component';

import {
  ReplacementDisplays,
  PAGE_SIZE,
} from '#libs/replacement-request/constants';
import { RootState } from '../../../reducers';
import {
  getOfferCalendarStateData,
  withCoach,
  withEstablishment,
  withMetaActivity,
} from '#libs/offer/selectors';
import { withCustomLevel } from '#libs/level/selectors';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import {
  withEstablishment as groupWithEstablishment,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';
import { fetchAllOffersPaginated as fetchAllOffersPaginatedAction } from '#libs/offer/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#libs/meta-activity/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { WithHandlerType } from '../../../utils/types';

type ConnectProps = ConnectedProps<typeof connector>;
type Props = ConnectProps & WithHandlerType<typeof handlers>;

export const CoachReplacement: React.FC<Props> = (props: Props) => {
  const {
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    fetchReplacementOffers,
    offerCount,
    offerPage,
    companyId,
    replacementOfferList,
    replacementRequestLoading,
    establishmentGroupLoading,
    metaActivityLoading,
    establishmentLoading,
    offerBulkLoading,
    companyTheme,
  } = props;
  const classes = useStyles();

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

  useEffect(() => fetchReplacementOffers(1), [fetchReplacementOffers]);

  const totalPages = useMemo(
    () => Math.ceil(offerCount / PAGE_SIZE),
    [offerCount],
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
            replacementDisplay={ReplacementDisplays.REPLACEMENT_DISPLAY_CONFIRM}
            offers={replacementOfferList}
            establishmentGroups={props.establishmentGroupList}
            isLoading={isLoading}
            timezoneName={companyTheme.timezone_name}
          />
        </TableContainer>
        {offerCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={totalPages}
            page={offerPage}
            // fetch requested page on page change
            onChange={(ev, value) => fetchReplacementOffers(value)}
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
    replacementOfferList: withEstablishment(
      withCustomLevel(withMetaActivity(withCoach(getOfferCalendarStateData))),
    )(state),
    offerCount: state.offer.paginatedCalendar.count,
    offerPage: state.offer.paginatedCalendar.page,

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
    fetchAllOffersPaginated: fetchAllOffersPaginatedAction,
  },
);

const handlers = {
  fetchReplacementOffers:
    ({ fetchAllOffersPaginated, companyId, coach }: ConnectProps) =>
    (page: number) => {
      fetchAllOffersPaginated({
        only_future: true,
        coach_override: coach.id,
        company: companyId,
        page_size: PAGE_SIZE,
        page,
      });
    },
};

export default compose(connector, withHandlers(handlers))(CoachReplacement);
