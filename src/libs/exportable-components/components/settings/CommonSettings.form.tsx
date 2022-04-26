import React, { useCallback } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useTranslation } from 'react-i18next';
import {
  MarketplaceCalendarData,
  MarketplaceCommonFilter,
  MarketplaceWorkshopData,
} from '../../types';

import { Coach } from '../../../associated-coach/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import { Level } from '#libs/level/types';
import LevelMultiSelector from '#libs/level/components/LevelMultiSelector.component';

interface Props {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  establishmentGroupList: Array<EstablishmentGroup>;
  config?: MarketplaceCalendarData | MarketplaceWorkshopData;
  onChange: (
    calendarConfig: MarketplaceCalendarData | MarketplaceWorkshopData,
  ) => void;
  customLevels: Level[];
}

const MarketplaceCommonFilterForm: React.FC<Props> = (props) => {
  const {
    coaches,
    establishments,
    metaActivities,
    establishmentGroupList,
    config,
    onChange,
  } = props;

  const setData = useCallback(
    (key: keyof MarketplaceCommonFilter, values: any) => {
      let newEstablishments: number[] = config.establishments;
      let newEstablishmentGroups: number[] = config.establishmentGroups;

      if (key === 'establishmentGroups') {
        newEstablishmentGroups = values.map((eg: EstablishmentGroup) => eg.id);
        newEstablishments = values
          .flatMap((eg: EstablishmentGroup) => eg.establishment)
          .map((e: Establishment) => e.id);
      }
      if (key === 'establishments') {
        newEstablishments = values.map((e: Establishment) => e.id);
        newEstablishmentGroups = establishmentGroupList
          .filter((eg: EstablishmentGroup) =>
            (eg.establishment || [])
              .map((e: Establishment) => e.id)
              .every((e_id: number) => newEstablishments.includes(e_id)),
          )
          .filter((eg: EstablishmentGroup) => eg.establishment.length !== 0)
          .map((eg: EstablishmentGroup) => eg.id);
      }
      const newConfig: MarketplaceCalendarData | MarketplaceWorkshopData = {
        ...config,
        [key]: values.map((a: any) => a.id),
        establishments: newEstablishments,
        establishmentGroups: newEstablishmentGroups,
      };
      onChange(newConfig);
    },
    [config, establishmentGroupList, onChange],
  );

  const classes = useStyles();
  const { t } = useTranslation();

  if (!config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      <div className={classes.marginTop}>
        <Autocomplete
          multiple
          options={[...coaches]}
          getOptionLabel={(option) => option.name}
          value={[
            ...coaches.filter(
              (c) => config.coaches && config.coaches.includes(c.id),
            ),
          ]}
          onChange={(e, newValue) => setData('coaches', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('coach:coach')}
              placeholder={t('coach:coach')}
            />
          )}
        />
      </div>
      {!!establishmentGroupList && (
        <div className={classes.marginTop}>
          <Autocomplete
            multiple
            options={[...establishmentGroupList]}
            getOptionLabel={(option) => option.name}
            value={[
              ...establishmentGroupList.filter(
                (l) =>
                  config.establishmentGroups &&
                  config.establishmentGroups.includes(l.id),
              ),
            ]}
            onChange={(e, newValue) => {
              setData('establishmentGroups', newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={t('establishment:localisation')}
                placeholder={t('establishment:localisation')}
              />
            )}
          />
        </div>
      )}
      <div className={classes.marginTop}>
        <Autocomplete
          multiple
          options={[...establishments]}
          getOptionLabel={(option) => option.title}
          value={[
            ...establishments.filter(
              (e) =>
                config.establishments && config.establishments.includes(e.id),
            ),
          ]}
          onChange={(e, newValue) => setData('establishments', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('establishment:room')}
              placeholder={t('establishment:room')}
            />
          )}
        />
      </div>

      <div className={classes.marginTop}>
        <Autocomplete
          multiple
          options={[...metaActivities]}
          getOptionLabel={(option) => option.name}
          value={[
            ...metaActivities.filter(
              (m) =>
                config.metaActivities && config.metaActivities.includes(m.id),
            ),
          ]}
          onChange={(e, newValue) => setData('metaActivities', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('metaActivity:metaActivity')}
              placeholder={t('metaActivity:metaActivity')}
            />
          )}
        />
      </div>
      <div className={classes.marginTop}>
        <LevelMultiSelector
          inScrollBar
          selectedLevels={config.levels}
          onSelect={(data) => {
            setData(
              'levels',
              data.map((l) => ({ id: l })),
            );
          }}
          customLevels={props.customLevels}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(1),
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

export default MarketplaceCommonFilterForm;
