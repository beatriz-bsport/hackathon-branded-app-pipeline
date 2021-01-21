import React, { useCallback } from 'react';
import {
  InputLabel,
  FormControl,
  makeStyles,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MarketplaceCalendarData } from '../../types';

import { Coach } from '../../../associated-coach/types';
import { Establishment } from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import MarketplaceCommonFilterForm from './MarketplaceCommonFilterForm.component';

interface Props {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  config?: MarketplaceCalendarData;
  onChange: (calendarConfig: MarketplaceCalendarData) => void;
  showCompactMode?: boolean;
}

const COMPACT_MODE_TYPE = {
  listDisplay: true,
  calendarDisplay: false,
  // @ts-ignore
  responsiveDisplay: null,
};

const MarketplaceCalendarSettingsForm: React.FC<Props> = (props) => {
  const setCompactMode = useCallback(
    (value: keyof typeof COMPACT_MODE_TYPE) => {
      const config: MarketplaceCalendarData = {
        ...props.config,
        compactMode: COMPACT_MODE_TYPE[value],
      };
      props.onChange(config);
    },
    [props.config],
  );

  const classes = useStyles();
  const { t } = useTranslation();

  if (!props.config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      {props.showCompactMode && (
        <FormControl className={classes.compactModeContainer}>
          <InputLabel>{t('widget:widget.choice')}</InputLabel>
          <Select
            className={classes.fullWidth}
            value={Object.keys(COMPACT_MODE_TYPE).find(
              (key: keyof typeof COMPACT_MODE_TYPE) =>
                COMPACT_MODE_TYPE[key] === props.config.compactMode,
            )}
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

      <MarketplaceCommonFilterForm
        coaches={props.coaches}
        establishments={props.establishments}
        metaActivities={props.metaActivities}
        config={props.config}
        onChange={props.onChange}
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
    marginTop: theme.spacing(4),
  },
}));

export default MarketplaceCalendarSettingsForm;
