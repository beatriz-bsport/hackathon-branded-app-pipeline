import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
// @ts-expect-error
import SCTSelector from '#src/libs/category/components/SCTSelectorBase.component';
import CoachSelector from '#src/libs/associated-coach/components/coach-selector/CoachSelector.component';
import LevelMultiSelector from '#src/libs/level/components/LevelMultiSelector.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { SCT } from '#src/libs/category/types';
import type { Level } from '#src/libs/level/types';
// @ts-expect-error
import DurationSelector from './DurationSelector.component';
import DelayedTextField from '../../../components/DelayedTextField.component';

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
  coachDisplay?: MarketPlaceCoachDisplay;
  scts: SCT[];
  customLevels: Level[];
};

export const VideoSearchBar: React.FC<Props> = ({
  searchParams,
  hideCoach,
  onChangeSearchParams,
  coaches,
  coachDisplay,
  scts,
  customLevels,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('video');

  const {
    levels,
    coaches: _selectedCoaches,
    SCTs,
    duration_second_range,
    search,
  } = searchParams;

  const selectedLevels = useMemo(() => {
    return levels
      ? levels.split(',').map((value) => parseInt(value, 10))
      : null;
  }, [levels]);

  const selectedScts = useMemo(() => {
    return SCTs ? SCTs.split(',').map((value) => parseInt(value, 10)) : null;
  }, [SCTs]);

  const selectedCoaches = useMemo(() => {
    return _selectedCoaches
      ? _selectedCoaches.split(',').map((value) => parseInt(value, 10))
      : null;
  }, [_selectedCoaches]);

  const handleSelectCustomLevel = useCallback(
    (data) => {
      if (data.length) {
        onChangeSearchParams('levels')(data.join(','));
      } else {
        onChangeSearchParams('levels')(null);
      }
    },
    [onChangeSearchParams],
  );

  const handleSelectSCT = useCallback(
    (scts_: { value: SCT; label: string }[]) => {
      if (scts_ && scts_.length) {
        onChangeSearchParams('SCTs')(scts_.map((sct_) => sct_.value).join());
      } else {
        onChangeSearchParams('SCTs')(null);
      }
    },
    [onChangeSearchParams],
  );

  const handleSelectDurationRange = useCallback(
    (durationRange) => {
      if (durationRange) {
        const [min, max] = durationRange;
        onChangeSearchParams('duration_second_range')(`${min},${max}`);
      } else {
        onChangeSearchParams('duration_second_range')(null);
      }
    },
    [onChangeSearchParams],
  );
  const handleSelectCoach = useCallback(
    (coaches_: { value: Coach; label: string }[]) => {
      if (coaches_ && coaches_.length) {
        onChangeSearchParams('coaches')(coaches_.map((e) => e.value).join());
      } else {
        onChangeSearchParams('coaches')(null);
      }
    },
    [onChangeSearchParams],
  );

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeSearchParams('search')(event.target.value);
    },
    [onChangeSearchParams],
  );

  const handleClearSearchText = useCallback(
    () => onChangeSearchParams('search')(''),
    [onChangeSearchParams],
  );

  return (
    <Grid container direction="row" spacing={1}>
      <Grid item md={3} xs={6}>
        <LevelMultiSelector
          customLevels={customLevels}
          onSelect={handleSelectCustomLevel}
          selectedLevels={selectedLevels}
        />
      </Grid>
      <Grid item lg={2} md={3} xs={6}>
        <SCTSelector
          closeMenuOnSelect
          isClearable
          shouldSetMinHeight
          scts={scts}
          selectedValues={selectedScts}
          selectOption={handleSelectSCT}
        />
      </Grid>
      <Grid item lg={2} md={3} xs={6}>
        <DurationSelector
          shouldSetMinHeight
          durationSecondRange={duration_second_range}
          onChange={handleSelectDurationRange}
        />
      </Grid>
      <Grid item md={3} xs={6}>
        {!hideCoach && (
          <CoachSelector
            isClearable
            shouldSetMinHeight
            coachDisplay={coachDisplay}
            coaches={coaches}
            selectedCoaches={selectedCoaches}
            selectOption={handleSelectCoach}
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
            endAdornment: searchParams.search ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={searchParams.search ? 'Clear search' : 'Search'}
                  onClick={handleClearSearchText}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          onChange={handleTextChange}
          placeholder={t('video.search.placeholder')}
          size="small"
          value={search}
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
