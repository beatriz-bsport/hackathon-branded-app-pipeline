import React, { useCallback } from 'react';
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
  MarketplaceCalendarV2Data,
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
  config?: MarketplaceCalendarV2Data;
  onChange: (calendarConfig: MarketplaceCalendarV2Data) => void;
  showCompactMode?: boolean;
  establishmentGroupList: Array<EstablishmentGroup>;
  customLevels: Level[];
}

const COMPACT_MODE_TYPE = {
  listDisplay: true,
  calendarDisplay: false,
  // @ts-ignore
  responsiveDisplay: null,
  todayOnly: 'today',
};

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
    (value: keyof typeof COMPACT_MODE_TYPE) => {
      const newConfig: MarketplaceCalendarV2Data = {
        ...config,
        todayOnly: COMPACT_MODE_TYPE[value] === 'today',
        compactMode:
          COMPACT_MODE_TYPE[value] === 'today'
            ? true
            : COMPACT_MODE_TYPE[value],
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setVariant = useCallback(
    (variant: MarketplaceCalendarVariant) => {
      const newConfig: MarketplaceCalendarV2Data = {
        ...config,
        variant,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setGroupSessionBy = useCallback(
    (_: any, groupSessionByPeriod: boolean) => {
      const newConfig: MarketplaceCalendarV2Data = {
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
            value={
              Object.keys(COMPACT_MODE_TYPE).find(
                (key: keyof typeof COMPACT_MODE_TYPE) =>
                  COMPACT_MODE_TYPE[key] === config.compactMode,
              ) ?? 'responsiveDisplay'
            }
            onChange={(ev: any) => setCompactMode(ev.target.value)}
          >
            {Object.keys(COMPACT_MODE_TYPE).map((key) => {
              return (
                <MenuItem key={key} value={key}>
                  {t(`widget:widget.${key}`)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      {config.compactMode !== false && (
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
          onChange={(ev: any) => setVariant(ev.target.value)}
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
