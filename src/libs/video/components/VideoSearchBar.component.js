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
    level: string,
    coach: string,
    SCT: string,
    duration_second_range: string,
    search: string,
  },
  onChangeSearchParams: (string) => (?string) => void,
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
          isNotMulti
          isClearable
          selectedLevels={[parseInt(props.searchParams.level, 10)]}
          selectOption={(ev) => {
            if (!ev) {
              props.onChangeSearchParams('level')(null);
            } else {
              props.onChangeSearchParams('level')(ev.value);
            }
          }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <CoachSelector
          selectedCoaches={[parseInt(props.searchParams.coach, 10)]}
          selectOption={(ev) => {
            if (!ev) {
              props.onChangeSearchParams('coach')(null);
            } else {
              props.onChangeSearchParams('coach')(ev.value);
            }
          }}
          coaches={props.coaches}
          noMulti
          isClearable
        />
      </Grid>
      <Grid item xs={6} md={3} lg={2}>
        <SCTSelector
          scts={props.scts}
          selectedValues={[parseInt(props.searchParams.SCT, 0)]}
          closeMenuOnSelect
          selectOption={(ev) => {
            if (ev && ev.length) {
              props.onChangeSearchParams('SCT')(ev[0].value);
            } else {
              props.onChangeSearchParams('SCT')(null);
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
