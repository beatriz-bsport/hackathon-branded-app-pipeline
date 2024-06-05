import React, { useCallback } from 'react';
import uniq from 'lodash/uniq';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { LinearProgress } from '@material-ui/core';
import DisciplineGroupList from '#src/libs/replacement-request/components/discipline-group/DisciplineGroupList.component';
import DisciplineGroupDeleteDialog from '#src/libs/replacement-request/components/discipline-group/DisciplineGroupDeleteDialog.component';
import CompatibleCoachesList from '#src/libs/replacement-request/components/discipline-group/CompatibleCoachesList.component';
import DisciplineGroupFormDrawer from '#src/libs/replacement-request/components/discipline-group/DisciplineGroupForm.drawer';

import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import { DisciplineGroup } from '#src/libs/replacement-request/types';
import themeSelectors from '#src/libs/theme/selectors';
import {
  fetchDisciplineGroupList as fetchDisciplineGroupListAction,
  createDisciplineGroup as createDisciplineGroupAction,
  deleteDisciplineGroup as deleteDisciplineGroupAction,
  updateDisciplineGroup as updateDisciplineGroupAction,
} from '#src/libs/replacement-request/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#src/libs/associated-coach/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#src/libs/meta-activity/actions';
import {
  getEnabledWorkshops,
  getEnabledMetaActivities,
  getMetaActivityLoading,
} from '#src/libs/meta-activity/selectors';
import {
  getActiveCoaches,
  getCoachLoading,
} from '#src/libs/associated-coach/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import {
  getDisciplineGroupLoading,
  getAllDisciplineGroupsWithFullData,
} from '#src/libs/replacement-request/selectors';
import { computeNbCompatibleCoaches } from '#src/libs/replacement-request/utils';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
} from '#src/libs/establishment/selectors';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#src/libs/establishment/actions';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';

type Props = ConnectedProps<typeof connector>;

export const ReplacementDisciplineGroup: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {
    createDisciplineGroup,
    fetchDisciplineGroupList,
    deleteDisciplineGroup,
    updateDisciplineGroup,
    fetchAssociatedCoachesList,
    fetchActivitiesCompany,
    fetchEstablishments,
    fetchAllEstablishmentGroup,
    companyId,
  } = props;

  const { t } = useTranslation('replacement');

  const [disciplineGroupSelected, setDisciplineGroupSelected] =
    React.useState<DisciplineGroup>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  React.useEffect(() => {
    fetchAssociatedCoachesList({
      company: companyId,
      disabled: false,
    });
    fetchActivitiesCompany(companyId);
    fetchDisciplineGroupList();
    fetchEstablishments();
    fetchAllEstablishmentGroup();
  }, [
    fetchDisciplineGroupList,
    fetchAssociatedCoachesList,
    fetchActivitiesCompany,
    fetchEstablishments,
    fetchAllEstablishmentGroup,
    companyId,
  ]);

  const myStudioSCTs = React.useMemo(() => {
    const SCTids = uniq(
      props.activityList
        .map((activity) => activity.SCT)
        .concat(props.workshopList.map((workshop) => workshop.SCT)),
    );
    return SCTids.map((SCTid) =>
      props.SCTList.find((SCT) => SCT.id === SCTid),
    ).filter((SCT) => !!SCT);
  }, [props.SCTList, props.activityList, props.workshopList]);

  const compatibleCoachesByCategory = React.useMemo(
    () => computeNbCompatibleCoaches(props.coachList),
    [props.coachList],
  );

  const activitiesToDisplay = React.useMemo(() => {
    return props.activityList.filter((activity) => {
      const nbCompatibleCoaches =
        compatibleCoachesByCategory.activities[activity.id] ??
        compatibleCoachesByCategory.activities.all;
      return nbCompatibleCoaches > 0;
    });
  }, [props.activityList, compatibleCoachesByCategory]);

  const workshopsToDisplay = React.useMemo(() => {
    return props.workshopList.filter((workshop) => {
      const nbCompatibleCoaches =
        compatibleCoachesByCategory.workshops[workshop.id] ??
        compatibleCoachesByCategory.workshops.all;
      return nbCompatibleCoaches > 0;
    });
  }, [props.workshopList, compatibleCoachesByCategory]);

  const SCTsToDisplay = React.useMemo(() => {
    return myStudioSCTs.filter((SCT) => {
      const nbCompatibleCoaches =
        compatibleCoachesByCategory.SCTs[SCT.id] ??
        compatibleCoachesByCategory.SCTs.all;
      return nbCompatibleCoaches > 0;
    });
  }, [myStudioSCTs, compatibleCoachesByCategory]);

  const handleDelete = useCallback(
    (disciplineGroup: DisciplineGroup) => {
      setDisciplineGroupSelected(disciplineGroup);
      setDeleteOpen(true);
    },
    [setDisciplineGroupSelected, setDeleteOpen],
  );
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleDeleteConfirm = useCallback(() => {
    deleteDisciplineGroup(disciplineGroupSelected?.id, {
      onSuccess: () => {
        fetchDisciplineGroupList();
        // refetch coaches to update nb of compatible coaches
        fetchAssociatedCoachesList({
          company: companyId,
          disabled: false,
        });
        setDeleteOpen(false);
      },
    });
  }, [
    deleteDisciplineGroup,
    fetchDisciplineGroupList,
    setDeleteOpen,
    disciplineGroupSelected,
    fetchAssociatedCoachesList,
    companyId,
  ]);

  const handleOpenCreate = useCallback(() => {
    setDisciplineGroupSelected(null);
    setEditOpen(true);
  }, [setDisciplineGroupSelected, setEditOpen]);

  const handleSubmit = useCallback(
    (data, options?: OptionCallback) => {
      const submitOptions = {
        onSuccess: () => {
          setEditOpen(false);
          setDisciplineGroupSelected(null);
          // refetch coaches to update nb of compatible coaches
          fetchAssociatedCoachesList({
            company: companyId,
            disabled: false,
          });
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      };

      if ('id' in data) {
        updateDisciplineGroup(data.id, data, submitOptions);
      } else {
        createDisciplineGroup(data, submitOptions);
      }
    },
    [
      setEditOpen,
      createDisciplineGroup,
      fetchAssociatedCoachesList,
      updateDisciplineGroup,
      companyId,
    ],
  );

  const handleEdit = useCallback(
    (disciplineGroup: DisciplineGroup) => {
      setDisciplineGroupSelected(disciplineGroup);
      setEditOpen(true);
    },
    [setDisciplineGroupSelected, setEditOpen],
  );
  const handleEditClose = () => setEditOpen(false);

  return (
    <>
      {(props.disciplineGroupLoading ||
        props.metaActivityLoading ||
        props.coachLoading) && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item lg={6} xs={12}>
          <Paper className={classes.compatibleCoachesContainer} elevation={0}>
            <Typography className={classes.title} variant="h5">
              {t('disciplineGroup.title')}
            </Typography>
            <DisciplineGroupList
              // @ts-expect-error
              disciplineGroups={props.disciplineGroupList}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleOpenCreate={handleOpenCreate}
              loading={false}
            />
          </Paper>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Paper className={classes.compatibleCoachesContainer} elevation={0}>
            <Typography className={classes.title} variant="h5">
              {t('compatibleCoaches.title')}
            </Typography>
            <CompatibleCoachesList
              // @ts-expect-error
              activities={activitiesToDisplay}
              compatibleCoachesByCategory={compatibleCoachesByCategory}
              SCTs={SCTsToDisplay}
              // @ts-expect-error
              workshops={workshopsToDisplay}
            />
          </Paper>
        </Grid>
      </Grid>
      <DisciplineGroupDeleteDialog
        disciplineGroup={disciplineGroupSelected}
        loading={props.disciplineGroupLoading}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        open={deleteOpen}
      />
      <DisciplineGroupFormDrawer
        // @ts-expect-error
        activityList={props.activityList}
        categoryList={myStudioSCTs}
        coachList={props.coachList}
        companyTheme={props.theme}
        // @ts-expect-error
        disciplineGroup={disciplineGroupSelected}
        // @ts-expect-error
        establishmentGroupList={props.establishmentGroupList}
        establishmentList={props.establishmentList}
        handleClose={handleEditClose}
        onSubmit={handleSubmit}
        open={editOpen}
        // @ts-expect-error
        workshopList={props.workshopList}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  compatibleCoachesContainer: {
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  title: {
    color: theme.palette.grey[600],
  },
}));

const connector = connect(
  (state: RootState) => ({
    theme: themeSelectors.getTheme(state),
    companyId: state.theme.theme.company,
    coachList: getActiveCoaches(state),
    SCTList: getEditableSCTs(state),
    activityList: getEnabledMetaActivities(state),
    workshopList: getEnabledWorkshops(state),
    disciplineGroupList: getAllDisciplineGroupsWithFullData(state),
    disciplineGroupLoading: getDisciplineGroupLoading(state),
    metaActivityLoading: getMetaActivityLoading(state),
    coachLoading: getCoachLoading(state),
    establishmentList: getAvailableEstablishmentList(state),
    establishmentGroupList: getAssociatedEstablishmentGroup(state),
  }),
  {
    fetchCompanyTheme: fetchCompanyThemeAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    createDisciplineGroup: createDisciplineGroupAction,
    fetchDisciplineGroupList: fetchDisciplineGroupListAction,
    deleteDisciplineGroup: deleteDisciplineGroupAction,
    updateDisciplineGroup: updateDisciplineGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  },
);

export default connector(ReplacementDisciplineGroup);
