// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import {
  InputLabel,
  FormControl,
  makeStyles,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  MarketplaceCalendarData,
  MarketplaceCalendarVariant,
} from '../../../marketplace/types';

import { Coach } from '../../../associated-coach/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import CommonSettings from './CommonSettings.form';
import { Level } from '#libs/level/types';

interface Props {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  config?: MarketplaceCalendarData;
  onChange: (calendarConfig: MarketplaceCalendarData) => void;
  showCompactMode?: boolean;
  establishmentGroupList: Array<EstablishmentGroup>;
  customLevels: Level[];
}

const LIST_DISPLAY = 'listDisplay';
const CALENDAR_DISPLAY = 'calendarDisplay';
const RESPONSIVE_DISPLAY = 'responsiveDisplay';
const TODAY_ONLY = 'todayOnly';

const COMPACT_MODE_TYPE = [
  LIST_DISPLAY,
  CALENDAR_DISPLAY,
  RESPONSIVE_DISPLAY,
  TODAY_ONLY,
];

const VARIANTS: MarketplaceCalendarVariant[] = [
  'activityName',
  'coach',
  'time',
];

const MarketplaceCalendarV2SettingsForm: React.FC<Props> = (props) => {
  const {
    coaches,
    establishments,
    metaActivities,
    config = {},
    onChange,
    showCompactMode,
    establishmentGroupList,
  } = props;

  const setCompactMode = useCallback(
    (value: string) => {
      const newConfig: MarketplaceCalendarData = {
        ...config,
        todayOnly: value === TODAY_ONLY,
        compactMode:
          value === RESPONSIVE_DISPLAY
            ? null
            : value === TODAY_ONLY || value === LIST_DISPLAY,
      };

      onChange(newConfig);
    },
    [config, onChange],
  );

  const compactMode = useMemo(() => {
    if (config.todayOnly) {
      return TODAY_ONLY;
    }

    if (config.compactMode) {
      return LIST_DISPLAY;
    }

    if (config.compactMode === null) {
      return RESPONSIVE_DISPLAY;
    }
    return CALENDAR_DISPLAY;
  }, [config]);

  const setVariant = useCallback(
    (variant: MarketplaceCalendarVariant) => {
      const newConfig: MarketplaceCalendarData = {
        ...config,
        variant,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setGroupSessionBy = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, groupSessionByPeriod: boolean) => {
      const newConfig: MarketplaceCalendarData = {
        ...config,
        groupSessionByPeriod,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const classes = useStyles();
  const { t } = useTranslation();

  if (!config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      {showCompactMode && (
        <FormControl className={classes.compactModeContainer}>
          <InputLabel>{t('widget:widget.choice')}</InputLabel>
          <Select
            className={classes.fullWidth}
            value={compactMode}
            onChange={(ev: React.ChangeEvent<HTMLSelectElement>) =>
              setCompactMode(ev.target.value)
            }
          >
            {COMPACT_MODE_TYPE.map((key) => {
              return (
                <MenuItem key={key} value={key}>
                  {t(`widget:widget.${key}`)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      {!config.todayOnly &&
        (compactMode === CALENDAR_DISPLAY ||
          compactMode === RESPONSIVE_DISPLAY) && (
          <FormControlLabel
            control={
              <Switch
                checked={config?.groupSessionByPeriod ?? true}
                onChange={setGroupSessionBy}
                color="primary"
              />
            }
            label={t('widget:widget.groupSessionByPeriod')}
          />
        )}

      <FormControl className={classes.compactModeContainer}>
        <InputLabel>{t('widget:widget.variant')}</InputLabel>
        <Select
          className={classes.fullWidth}
          value={config.variant ?? 'activityName'}
          onChange={(ev: React.ChangeEvent<HTMLSelectElement>) =>
            setVariant(ev.target.value as MarketplaceCalendarVariant)
          }
        >
          {VARIANTS.map((key) => {
            return (
              <MenuItem key={key} value={key}>
                {t(`widget:widget.variantOption.${key}`)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <CommonSettings
        coaches={coaches}
        establishmentGroupList={establishmentGroupList}
        establishments={establishments}
        metaActivities={metaActivities}
        customLevels={props.customLevels}
        config={config}
        onChange={onChange}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  compactModeContainer: {
    marginTop: theme.spacing(1),
  },
  todayOnly: {
    marginTop: theme.spacing(1),
  },
}));

export default MarketplaceCalendarV2SettingsForm;
