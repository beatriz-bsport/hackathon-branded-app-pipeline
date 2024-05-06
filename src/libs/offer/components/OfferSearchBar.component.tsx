import React, { useCallback, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core';

import Grid, { GridSize } from '@material-ui/core/Grid';
import type { ValueType } from 'react-select/lib/types';

import { useTranslation } from 'react-i18next';
import {
  getGroupedEstablishmentOptions,
  GroupHeading,
} from '#libs/establishment/components/EstablishmentSelector.component';
import RollCallSelector from '#libs/offer/components/RollCallSelector.component';
import SubTeacherRequestSelector from '#libs/offer/components/SubTeacherRequestSelector.component';

import type {
  Establishment,
  EstablishmentGroup,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';
import type { CompanyTheme } from '#libs/theme/types';
import ObjectSearchComponent from '#libs/fuzzy-search/components/ObjectSearch.component';
import type { OfferFilter } from '#libs/offer/types';
import type { Coach } from '#libs/associated-coach/types';
import { SelectOption } from '#src/libs/types';

export const FILTER_COACH = 0;
export const FILTER_ESTABLISHMENT = 1;
export const FILTER_ACTIVITY = 2;
export const FILTER_ROLLCALL = 3;
export const FILTER_ESTABLISHMENT_GROUP = 4;
export const FILTER_SUB_REQUEST_TEACHER = 5;

const useStyles = makeStyles((theme: Theme) => ({
  selector: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

type Props = {
  theme: CompanyTheme;
  coachesSelectedInRole: Coach[];
  establishmentGroupList: EstablishmentGroup[];
  offerFilters: OfferFilter;
  filterVerification: boolean;
  setCalendarFilter: (
    ev:
      | { label: string; value: number }[]
      | string
      | number
      | Array<number | string>,
    filterType: number,
  ) => void;
  selectRollCallFilter: (ev: React.SyntheticEvent) => void;
  selectSubTeacherRequestFilter: (
    value: ValueType<{
      value: string;
      label: string;
    }>,
  ) => void;
  selectedRollCallStatus: number;
  showSubTeacherFilter: boolean;
};

const OfferSearchBar: React.FC<Props> = ({
  theme,
  establishmentGroupList,
  offerFilters,
  filterVerification,
  coachesSelectedInRole,
  setCalendarFilter,
  selectRollCallFilter,
  selectSubTeacherRequestFilter,
  selectedRollCallStatus,
  showSubTeacherFilter,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['coach', 'establishment', 'metaActivity']);

  const hasMultiLocation =
    theme?.enable_multi_localization &&
    establishmentGroupList &&
    establishmentGroupList.length !== 0;
  let mediumSize = 4;
  if (hasMultiLocation || theme.is_roll_call_mandatory) {
    mediumSize = 3;
  }
  if (hasMultiLocation && theme.is_roll_call_mandatory) {
    mediumSize = 2;
  }

  const formatEstablishments = useCallback(
    (establishments: Establishment[]) =>
      getGroupedEstablishmentOptions([...establishments]),
    [],
  );

  const setCoachCalendarFilter = useCallback(
    (selectedOptions: SelectOption<number>[]) => {
      setCalendarFilter(selectedOptions, FILTER_COACH);
    },
    [setCalendarFilter],
  );

  const setEstablishmentGroupCalendarFilter = useCallback(
    (selectedOptions: SelectOption<number>[]) => {
      setCalendarFilter(selectedOptions, FILTER_ESTABLISHMENT_GROUP);
    },
    [setCalendarFilter],
  );

  const setEstablishmentCalendarFilter = useCallback(
    (selectedOptions: SelectOption<number>[]) => {
      setCalendarFilter(selectedOptions, FILTER_ESTABLISHMENT);
    },
    [setCalendarFilter],
  );

  const setActivityCalendarFilter = useCallback(
    (selectedOptions: SelectOption<number>[]) => {
      setCalendarFilter(selectedOptions, FILTER_ACTIVITY);
    },
    [setCalendarFilter],
  );

  const formatEstablishmentGroups = useCallback(
    (establishmentGroup: Array<EstablishmentGroupAPI>) => {
      return establishmentGroup.map((group) => {
        return {
          label: group.name,
          value: group.id,
          establishments: group.establishment,
        };
      });
    },
    [],
  );

  const allowedCoaches = useMemo(() => {
    return coachesSelectedInRole.map((coach) => coach.id);
  }, [coachesSelectedInRole]);

  return (
    <Grid container style={{ overflow: 'auto' }}>
      <Grid
        item
        className={classes.selector}
        // @ts-expect-error
        md={mediumSize}
        xs={6}
      >
        <ObjectSearchComponent
          hideSelectedOptions
          isMulti
          additionalParams={{ disabled: false, id__in: allowedCoaches }}
          components={{ GroupHeading }}
          initialValues={offerFilters.coaches}
          onChange={setCoachCalendarFilter}
          placeholder={t('coach:coach')}
          searchedObjectType="associated_coach"
        />
      </Grid>
      {hasMultiLocation && (
        <Grid
          item
          className={classes.selector}
          // @ts-expect-error
          md={mediumSize}
          xs={6}
        >
          <ObjectSearchComponent
            hideSelectedOptions
            isMulti
            initialValues={offerFilters.establishment_group__in}
            onChange={setEstablishmentGroupCalendarFilter}
            optionsFormatter={formatEstablishmentGroups}
            placeholder={t('establishment:localisation')}
            searchedObjectType="establishment_group"
          />
        </Grid>
      )}
      <Grid
        item
        className={classes.selector}
        // @ts-expect-error
        md={mediumSize}
        xs={6}
      >
        <ObjectSearchComponent
          hideSelectedOptions
          isMulti
          openMenuOnClick
          components={{ GroupHeading }}
          initialValues={offerFilters.establishments}
          onChange={setEstablishmentCalendarFilter}
          optionsFormatter={formatEstablishments}
          placeholder={t('establishment:room')}
          searchedObjectType="establishment"
        />
      </Grid>
      <Grid
        item
        className={classes.selector}
        // @ts-expect-error
        md={mediumSize}
        xs={6}
      >
        <ObjectSearchComponent
          hideSelectedOptions
          isMulti
          additionalParams={{
            is_workshop: false,
            customer_enabled: true,
          }}
          initialValues={offerFilters.activity__in}
          onChange={setActivityCalendarFilter}
          placeholder={t('metaActivity:metaActivity')}
          searchedObjectType="meta_activity"
        />
      </Grid>
      {theme.is_roll_call_mandatory && selectedRollCallStatus && (
        <Grid
          item
          className={classes.selector}
          // @ts-expect-error
          md={mediumSize}
          xs={6}
        >
          <RollCallSelector
            selectedRollCallStatus={
              // @ts-expect-error type not matching
              filterVerification && offerFilters.roll_call_needs_validation
            }
            selectOption={selectRollCallFilter}
          />
        </Grid>
      )}
      {showSubTeacherFilter && (
        <Grid
          item
          className={classes.selector}
          md={mediumSize as GridSize}
          xs={6}
        >
          <SubTeacherRequestSelector
            // @ts-expect-error type not matching
            selectedFilter={offerFilters.has_active_sub_teacher_request}
            selectSubTeacherRequestFilter={selectSubTeacherRequestFilter}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(OfferSearchBar);
