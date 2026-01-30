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
import { Level } from '#src/libs/level/types';
import {
  MarketplaceCalendarData,
  MarketplaceCalendarVariant,
} from '../../../marketplace/types';

import type { Coach } from '#src/libs/associated-coach/types';
import type {
  Establishment,
  EstablishmentGroup,
} from '#src/libs//establishment/types';
import type { MetaActivity } from '#src/libs//meta-activity/types';
import CommonSettings from './CommonSettings.form';

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

  const setCardMode = useCallback(
    (value: string) => {
      const newConfig: MarketplaceCalendarData = {
        ...config,
        todayOnly: value === TODAY_ONLY,
        cardMode:
          value === RESPONSIVE_DISPLAY
            ? null
            : value === TODAY_ONLY
            ? false
            : value === CALENDAR_DISPLAY,
      };

      onChange(newConfig);
    },
    [config, onChange],
  );

  const cardMode = useMemo(() => {
    if (config.todayOnly) {
      return TODAY_ONLY;
    }

    if (config.cardMode) {
      return CALENDAR_DISPLAY;
    }

    if (config.cardMode === null) {
      return RESPONSIVE_DISPLAY;
    }
    return LIST_DISPLAY;
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
        <FormControl className={classes.cardModeContainer}>
          <InputLabel>{t('widget:widget.choice')}</InputLabel>
          <Select
            className={classes.fullWidth}
            onChange={(ev: React.ChangeEvent<HTMLSelectElement>) =>
              setCardMode(ev.target.value)
            }
            value={cardMode}
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
        (cardMode === CALENDAR_DISPLAY || cardMode === RESPONSIVE_DISPLAY) && (
          <FormControlLabel
            control={
              <Switch
                checked={config?.groupSessionByPeriod ?? true}
                color="primary"
                onChange={setGroupSessionBy}
              />
            }
            label={t('widget:widget.groupSessionByPeriod')}
          />
        )}

      <FormControl className={classes.cardModeContainer}>
        <InputLabel>{t('widget:widget.variant')}</InputLabel>
        <Select
          className={classes.fullWidth}
          onChange={(ev: React.ChangeEvent<HTMLSelectElement>) =>
            setVariant(ev.target.value as MarketplaceCalendarVariant)
          }
          value={config.variant ?? 'activityName'}
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
        config={config}
        customLevels={props.customLevels}
        establishmentGroupList={establishmentGroupList}
        establishments={establishments}
        metaActivities={metaActivities}
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
  cardModeContainer: {
    marginTop: theme.spacing(1),
  },
  todayOnly: {
    marginTop: theme.spacing(1),
  },
}));

export default MarketplaceCalendarV2SettingsForm;
