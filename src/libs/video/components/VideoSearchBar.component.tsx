import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import DelayedTextField from '../../../components/DelayedTextField.component';
// @ts-expect-error
import SCTSelector from '#libs/category/components/SCTSelectorBase.component';
import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
// @ts-expect-error
import DurationSelector from './DurationSelector.component';
import LevelMultiSelector from '#libs/level/components/LevelMultiSelector.component';

import type { Coach } from '#libs/associated-coach/types';
import type { SCT } from '#libs/category/types';
import type { Level } from '#libs/level/types';

import { MIN_HEIGHT_VIDEO_SEARCH_BAR_FIELDS } from '../constant';

type Props = {
  searchParams: {
    levels?: string;
    coaches?: string;
    SCTs?: string;
    duration_second_range?: string;
    search?: string;
  };
  hideCoach: boolean;
  onChangeSearchParams: (paramType: string) => (value: string) => void;
  coaches: Coach[];
  scts: SCT[];
  customLevels: Level[];
};

export const VideoSearchBar: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <Grid container direction="row" spacing={1}>
      <Grid item md={3} xs={6}>
        <LevelMultiSelector
          customLevels={props.customLevels}
          onSelect={(data) => {
            if (data.length) {
              props.onChangeSearchParams('levels')(data.join(','));
            } else {
              props.onChangeSearchParams('levels')(null);
            }
          }}
          selectedLevels={
            props.searchParams.levels
              ? props.searchParams.levels
                  .split(',')
                  .map((value) => parseInt(value, 10))
              : null
          }
        />
      </Grid>
      <Grid item lg={2} md={3} xs={6}>
        <SCTSelector
          closeMenuOnSelect
          isClearable
          shouldSetMinHeight
          scts={props.scts}
          selectedValues={
            props.searchParams.SCTs
              ? props.searchParams.SCTs.split(',').map((value) =>
                  parseInt(value, 10),
                )
              : null
          }
          selectOption={(ev) => {
            if (ev && ev.length) {
              props.onChangeSearchParams('SCTs')(ev.map((e) => e.value).join());
            } else {
              props.onChangeSearchParams('SCTs')(null);
            }
          }}
        />
      </Grid>
      <Grid item lg={2} md={3} xs={6}>
        <DurationSelector
          shouldSetMinHeight
          durationSecondRange={props.searchParams.duration_second_range}
          onChange={(ev) => {
            if (ev) {
              const [min, max] = ev;
              props.onChangeSearchParams('duration_second_range')(
                `${min},${max}`,
              );
            } else {
              props.onChangeSearchParams('duration_second_range')(null);
            }
          }}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        {!props.hideCoach && (
          <CoachSelector
            isClearable
            shouldSetMinHeight
            coachDisplay={props.coachDisplay}
            coaches={props.coaches}
            selectedCoaches={
              props.searchParams.coaches
                ? props.searchParams.coaches
                    .split(',')
                    .map((value) => parseInt(value, 10))
                : null
            }
            selectOption={(ev) => {
              if (ev && ev.length) {
                props.onChangeSearchParams('coaches')(
                  ev.map((e) => e.value).join(),
                );
              } else {
                props.onChangeSearchParams('coaches')(null);
              }
            }}
          />
        )}
      </Grid>
      <Grid item lg={2} md={12} xs={12}>
        <DelayedTextField
          fullWidth
          InputProps={{
            className: classes.input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: props.searchParams.search ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    props.searchParams.search ? 'Clear search' : 'Search'
                  }
                  onClick={() => props.onChangeSearchParams('search')(null)}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          onChange={(ev) => {
            props.onChangeSearchParams('search')(ev.target.value);
          }}
          placeholder={t('video.search.placeholder')}
          size="small"
          value={props.searchParams.search ? props.searchParams.search : ''}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  field: {
    width: '100%',
  },
  input: {
    minHeight: MIN_HEIGHT_VIDEO_SEARCH_BAR_FIELDS,
  },
}));

export default VideoSearchBar;
