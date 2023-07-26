import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Immutable from 'seamless-immutable';
import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
// @ts-ignore
import MetaActivitySelector from '#libs/meta-activity/components/MetaActivitySelector.component';
import EstablishmentGroupSelector from '#libs/establishment/components/EstablishmentGroupSelector.component';
import RollCallSelector from '#libs/offer/components/RollCallSelector.component';

import type { Coach } from '#libs/associated-coach/types';
import type {
  EstablishmentGroup,
  Establishment,
  EstablishmentGroupSelectOption,
} from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { CompanyTheme } from '#libs/theme/types';

export const FILTER_COACH = 0;
export const FILTER_ESTABLISHMENT = 1;
export const FILTER_ACTIVITY = 2;
export const FILTER_ROLLCALL = 3;
export const FILTER_ESTABLISHMENT_GROUP = 4;

const useStyles = makeStyles((theme: Theme) => ({
  selector: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

type Props = {
  theme: CompanyTheme;
  establishmentGroupList: EstablishmentGroup[];
  allEstablishments: Establishment[];
  establishmentsLoading: boolean;
  offerFilters: any;
  coachesLoading: boolean;
  metaActivities: MetaActivity[];
  activitiesLoading: boolean;
  coachesSelectedInRole: Coach[];
  coaches: Coach[];
  filterVerification: boolean;
  setCalendarFilter: (
    ev: string | number | Array<number | string>,
    filterType: number,
  ) => void;
  selectRollCallFilter: (ev: React.SyntheticEvent) => void;
  selectedRollCallStatus: number;
};

const OfferSearchBar = ({
  theme,
  establishmentGroupList,
  allEstablishments,
  establishmentsLoading,
  offerFilters,
  coachesLoading,
  metaActivities,
  activitiesLoading,
  coachesSelectedInRole,
  coaches,
  filterVerification,
  setCalendarFilter,
  selectRollCallFilter,
  selectedRollCallStatus,
}: Props) => {
  const classes = useStyles();

  const coachBaselist =
    coachesSelectedInRole?.length > 0 ? coachesSelectedInRole : coaches;
  const coachList = coachBaselist.map((e) => ({
    ...e,
    user: { name: e.name },
  }));
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

  let filteredEstablishments: Array<Establishment> = [...allEstablishments];

  if (offerFilters?.establishment_group__in?.length) {
    const filteredEstablishmentIds: Array<number> = establishmentGroupList
      .filter((eg: EstablishmentGroup) =>
        offerFilters.establishment_group__in.includes(eg.id),
      )
      .flatMap((eg: EstablishmentGroup) => eg.establishment)
      .map((e: Establishment) => e.id);

    const uniqueEstIds = offerFilters.establishments?.length
      ? [
          ...new Set(
            filteredEstablishmentIds.concat(offerFilters.establishments),
          ),
        ]
      : filteredEstablishmentIds;

    filteredEstablishments = [...allEstablishments].filter((e: Establishment) =>
      uniqueEstIds.includes(e.id),
    );
  }

  return (
    <Grid container style={{ overflow: 'auto' }}>
      <Grid
        item
        xs={6}
        // @ts-ignore
        md={mediumSize}
        className={classes.selector}
      >
        <CoachSelector
          coaches={Immutable(coachList)}
          selectedCoaches={filterVerification && offerFilters.coaches}
          selectOption={(ev: number) => setCalendarFilter(ev, FILTER_COACH)}
          isLoading={coachesLoading}
        />
      </Grid>
      {hasMultiLocation && (
        <Grid
          item
          xs={6}
          // @ts-ignore
          md={mediumSize}
          className={classes.selector}
        >
          <EstablishmentGroupSelector
            establishmentGroups={establishmentGroupList.filter(
              (group) => group.establishment.length !== 0,
            )}
            selectOption={(ev: EstablishmentGroupSelectOption[]) => {
              // @ts-expect-error
              setCalendarFilter(ev, FILTER_ESTABLISHMENT_GROUP);
            }}
            closeMenuOnSelect
            selectedEstablishmentGroups={
              filterVerification && offerFilters.establishment_group__in
            }
          />
        </Grid>
      )}
      <Grid
        item
        xs={6}
        // @ts-ignore
        md={mediumSize}
        className={classes.selector}
      >
        <EstablishmentSelector
          establishments={Immutable(filteredEstablishments)}
          selectedEstablishments={
            filterVerification && offerFilters.establishments
          }
          selectOption={(ev: number) =>
            setCalendarFilter(ev, FILTER_ESTABLISHMENT)
          }
          isLoading={establishmentsLoading}
        />
      </Grid>
      <Grid
        item
        xs={6}
        // @ts-ignore
        md={mediumSize}
        className={classes.selector}
      >
        <MetaActivitySelector
          metaActivities={metaActivities.filter(
            (ma) => ma.customer_enabled && !ma.is_workshop,
          )}
          selectedMetaActivities={
            filterVerification && offerFilters.activity__in
          }
          selectOption={(ev: number) => setCalendarFilter(ev, FILTER_ACTIVITY)}
          isLoading={activitiesLoading}
        />
      </Grid>
      {theme.is_roll_call_mandatory && selectedRollCallStatus && (
        <Grid
          item
          xs={6}
          // @ts-ignore
          md={mediumSize}
          className={classes.selector}
        >
          <RollCallSelector
            selectedRollCallStatus={
              filterVerification && offerFilters.roll_call_needs_validation
            }
            selectOption={selectRollCallFilter}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(OfferSearchBar);
