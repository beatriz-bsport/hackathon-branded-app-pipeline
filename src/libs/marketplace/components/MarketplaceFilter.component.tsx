import React from 'react';
import { Grid, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import LevelMultiSelector from '#src/libs/level/components/LevelMultiSelector.component';
import { Level } from '#src/libs/level/types';
import CoachSelector from '../../associated-coach/components/coach-selector/CoachSelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
// @ts-expect-error
import MetaActivitySelector from '../../meta-activity/components/MetaActivitySelector.component';
import { MaterialStyleType } from '../../../utils/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';
import { Coach } from '../../associated-coach/types';
import EstablishmentGroupSelector from '../../establishment/components/EstablishmentGroupSelector.component';
import { MarketPlaceFilter } from '../types';

type Props = {
  coaches: Coach[];
  hideCoach: boolean;
  establishments: Establishment[];
  establishmentGroupList: Array<EstablishmentGroup>;
  metaActivities: MetaActivity[];
  filters: MarketPlaceFilter;
  setFilters: (key: string) => (value: any) => void;
  variant: 'activity' | 'workshop';
  showMultiLocalization: boolean;
  customLevels: Level[];
} & MaterialStyleType<ReturnType<typeof styles>>;

type SelectOptions = {
  value: number;
  label: string;
  establishments?: Array<number>;
}[];

class MarketplaceFilterComponent extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      coaches,
      establishments,
      metaActivities,
      setFilters,
      filters,
      establishmentGroupList,
      customLevels,
    } = this.props;

    return (
      <Grid container>
        <Grid item className={classes.selector} md={12} xs={12}>
          {this.props.showMultiLocalization &&
            establishmentGroupList &&
            establishmentGroupList.length !== 0 && (
              <EstablishmentGroupSelector
                closeMenuOnSelect
                // @ts-expect-error
                isMulti
                establishmentGroups={establishmentGroupList.filter(
                  (group) => group.establishment.length !== 0,
                )}
                selectedEstablishmentGroups={filters.establishment_group__in}
                selectOption={(ev: SelectOptions) =>
                  setFilters('establishment_group__in')(ev.map((e) => e.value))
                }
              />
            )}
        </Grid>
        {!this.props.hideCoach && (
          <Grid item className={classes.selector} md={6} xs={12}>
            <CoachSelector
              coaches={coaches}
              selectedCoaches={filters.coaches}
              selectOption={(ev: SelectOptions) =>
                setFilters('coaches')(ev.map((e) => e.value))
              }
            />
          </Grid>
        )}
        <Grid item className={classes.selector} md={6} xs={12}>
          <LevelMultiSelector
            customLevels={customLevels}
            onSelect={(data) => {
              setFilters('levels')(data);
            }}
            selectedLevels={filters.levels}
          />
        </Grid>
        <Grid item className={classes.selector} md={6} xs={12}>
          <EstablishmentSelector
            // @ts-expect-error
            isMulti
            establishments={establishments}
            selectedEstablishments={filters.establishments}
            selectOption={(ev: SelectOptions) => {
              setFilters('establishments')(ev.map((e) => e.value));
            }}
          />
        </Grid>
        <Grid item className={classes.selector} md={6} xs={12}>
          <MetaActivitySelector
            metaActivities={metaActivities.filter((ma) => {
              if (this.props.variant === 'activity') {
                return ma.customer_enabled && !ma.is_workshop;
              }
              return ma.customer_enabled && ma.is_workshop;
            })}
            selectedMetaActivities={filters.activity__in}
            selectOption={(ev: SelectOptions) =>
              setFilters('activity__in')(ev.map((e) => e.value))
            }
            variant={this.props.variant}
          />
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme: Theme) => ({
  selector: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
});

export default withStyles(styles)(MarketplaceFilterComponent);
