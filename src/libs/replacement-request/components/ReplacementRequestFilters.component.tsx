// @ts-nocheck
import React, { useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import EstablishmentsSelector from '#libs/establishment/components/EstablishmentSelector.component';
import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import EstablishmentGroupSelector from '#libs/establishment/components/EstablishmentGroupSelector.component';
import MetaActivitySelector from '#libs/meta-activity/components/MetaActivitySelector.component';

import { Coach } from '#libs/associated-coach/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { ReplacementRequestFilter } from '#libs/replacement-request/types';

const FILTER_COACH = 0;
const FILTER_ESTABLISHMENT = 1;
const FILTER_ESTABLISHMENT_GROUP = 2;
const FILTER_ACTIVITY = 3;
const FILTER_CATEGORY = 4;

type Props = {
  coachList: Coach[];
  coachLoading: boolean;
  establishmentList: Establishment[];
  establishmentLoading: boolean;
  establishmentGroupList: EstablishmentGroup[];
  establishmentGroupLoading: boolean;
  metaActivityList: MetaActivity;
  metaActivityLoading: boolean;
  SCTOptions: Array<{ label: string; value: number }>;
  replacementRequestManagerFilter: ReplacementRequestFilter;
  setReplacementRequestManagerFilter: (
    values: Partial<ReplacementRequestFilter>,
  ) => void;
  enableMultiLocalization: boolean;
};

const ReplacementRequestFilters: React.FC<Props> = ({
  coachList,
  coachLoading,
  establishmentList,
  establishmentLoading,
  establishmentGroupList,
  establishmentGroupLoading,
  metaActivityList,
  metaActivityLoading,
  SCTOptions,
  replacementRequestManagerFilter,
  setReplacementRequestManagerFilter,
  enableMultiLocalization,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('replacement');

  const setFilter = useCallback(
    (
      newValues: Array<{ label: string; value: number | string }>,
      identifier: number,
    ) => {
      switch (identifier) {
        case FILTER_COACH:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            coach__in: newValues.map((e) => e.value),
          });
          break;
        case FILTER_ESTABLISHMENT:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            establishment__in: newValues.map((e) => e.value),
          });
          break;
        case FILTER_ESTABLISHMENT_GROUP:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            establishment_group__in: newValues.map((e) => e.value),
          });
          break;
        case FILTER_ACTIVITY:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            meta_activity__in: newValues.map((e) => e.value),
          });
          break;
        case FILTER_CATEGORY:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            category__in: newValues.map((e) => e.value),
          });
          break;
        default:
          break;
      }
    },
    [setReplacementRequestManagerFilter, replacementRequestManagerFilter],
  );

  return (
    <div className={classes.filtersContainer}>
      <Typography className={classes.filterTitle} variant="button">
        {t('marketplace.filters')}
      </Typography>
      <div className={classes.filters}>
        <CoachSelector
          coaches={coachList}
          isLoading={coachLoading}
          noMulti={false}
          selectedCoaches={replacementRequestManagerFilter.coach__in}
          selectOption={(ev) => setFilter(ev, FILTER_COACH)}
        />
      </div>
      <div className={classes.filters}>
        <EstablishmentsSelector
          closeMenuOnSelect={false}
          establishments={establishmentList}
          isLoading={establishmentLoading}
          noMulti={false}
          selectedEstablishments={
            replacementRequestManagerFilter.establishment__in
          }
          selectOption={(ev) => setFilter(ev, FILTER_ESTABLISHMENT)}
        />
      </div>
      {enableMultiLocalization && (
        <div className={classes.filters}>
          <EstablishmentGroupSelector
            closeMenuOnSelect={false}
            establishmentGroups={establishmentGroupList}
            isLoading={establishmentGroupLoading}
            noMulti={false}
            selectedEstablishmentGroups={
              replacementRequestManagerFilter.establishment_group__in
            }
            selectOption={(ev) => setFilter(ev, FILTER_ESTABLISHMENT_GROUP)}
          />
        </div>
      )}
      <div className={classes.filters}>
        <MetaActivitySelector
          isLoading={metaActivityLoading}
          metaActivities={metaActivityList}
          selectedMetaActivities={
            replacementRequestManagerFilter.meta_activity__in
          }
          selectOption={(ev) => setFilter(ev, FILTER_ACTIVITY)}
        />
      </div>
      <div className={classes.filters}>
        <Select
          isClearable
          isMulti
          onChange={(ev) => setFilter(ev, FILTER_CATEGORY)}
          options={SCTOptions}
          placeholder={t('selects.category')}
          value={
            replacementRequestManagerFilter.category__in
              ?.map((SCTId) =>
                SCTOptions.find((option) => option.value === SCTId),
              )
              .filter((sct) => !!sct) || []
          }
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      columnGap: theme.spacing(2),
      gridTemplateColumns: '1fr 1fr',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      justifySelf: 'stretch',
      width: 'unset',
      marginBottom: theme.spacing(1),
    },
  },
}));

export default ReplacementRequestFilters;
