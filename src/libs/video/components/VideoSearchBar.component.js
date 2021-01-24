// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import LevelSelector from '../../category/components/LevelSelector.component';
import SCTSelector from '../../category/components/SCTSelectorBase.component';
import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import DelayedTextField from '../../../components/DelayedTextField.component';
import DurationSelector from './DurationSelector.component';

type Props = {
  searchParams: {
    levels: string,
    coaches: string,
    SCTs: string,
    duration_second_range: string,
    search: string,
  },
  onChangeSearchParams: (string) => (string) => void,
  coaches: Array<Coach>,
  scts: Array<SCT>,
};

export const VideoSearchBar = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);
  return (
    <Grid spacing={1} container direction="row">
      <Grid item xs={6} md={3}>
        <LevelSelector
          isClearable
          selectedLevels={
            props.searchParams.levels
              ? props.searchParams.levels
                  .split(',')
                  .map((value) => parseInt(value, 10))
              : null
          }
          selectOption={(ev) => {
            if (ev && ev.length) {
              props.onChangeSearchParams('levels')(
                ev.map((e) => e.value).join(),
              );
            } else {
              props.onChangeSearchParams('levels')(null);
            }
          }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <CoachSelector
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
          coaches={props.coaches}
          isClearable
        />
      </Grid>
      <Grid item xs={6} md={3} lg={2}>
        <SCTSelector
          scts={props.scts}
          selectedValues={
            props.searchParams.SCTs
              ? props.searchParams.SCTs.split(',').map((value) =>
                  parseInt(value, 10),
                )
              : null
          }
          closeMenuOnSelect
          selectOption={(ev) => {
            if (ev && ev.length) {
              props.onChangeSearchParams('SCTs')(ev.map((e) => e.value).join());
            } else {
              props.onChangeSearchParams('SCTs')(null);
            }
          }}
          isClearable
        />
      </Grid>
      <Grid item xs={6} md={3} lg={2}>
        <DurationSelector
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
      <Grid item xs={12} md={12} lg={2}>
        <DelayedTextField
          onChange={(ev) => {
            props.onChangeSearchParams('search')(ev.target.value);
          }}
          fullWidth
          size="small"
          variant="outlined"
          value={props.searchParams.search}
          placeholder={t('video.search.placeholder')}
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
}));

export default VideoSearchBar;
