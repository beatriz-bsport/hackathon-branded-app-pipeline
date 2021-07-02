import React from 'react';
import { Grid, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '../../meta-activity/components/MetaActivitySelector.component';
import LevelSelector from '../../category/components/LevelSelector.component';
import { MaterialStyleType } from '../../../utils/types';
import { Establishment } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';
import { Coach } from '../../associated-coach/types';

type Props = {
  coaches: Coach[];
  hideCoach: boolean;
  establishments: Establishment[];
  metaActivities: MetaActivity[];
  filters: {
    coaches: number[];
    establishments: number[];
    levels: number[];
    activity__in: number[];
  };
  setFilters: (key: string) => (value: any) => void;
  variant: 'activity' | 'workshop';
} & MaterialStyleType<ReturnType<typeof styles>>;

type SelectOptions = { value: number; label: string }[];

class MarketplaceFilterComponent extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      coaches,
      establishments,
      metaActivities,
      setFilters,
      filters,
    } = this.props;

    return (
      <Grid container>
        {!this.props.hideCoach && (
          <Grid item xs={12} md={6} className={classes.selector}>
            <CoachSelector
              coaches={coaches}
              selectedCoaches={filters.coaches}
              selectOption={(ev: SelectOptions) =>
                setFilters('coaches')(ev.map((e) => e.value))
              }
            />
          </Grid>
        )}
        <Grid item xs={12} md={6} className={classes.selector}>
          <LevelSelector
            selectedLevels={filters.levels}
            selectOption={(ev: SelectOptions) =>
              setFilters('levels')(ev.map((e) => e.value))
            }
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.selector}>
          <EstablishmentSelector
            isMulti
            establishments={establishments}
            selectedEstablishments={filters.establishments}
            selectOption={(ev: SelectOptions) => {
              setFilters('establishments')(ev.map((e) => e.value));
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.selector}>
          <MetaActivitySelector
            variant={this.props.variant}
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
