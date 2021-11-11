import React, { useCallback } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
// @ts-ignore
import LEVELS from '@bsport/common/lib/master-data/levels';

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

interface Props {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  establishmentGroupList: Array<EstablishmentGroup>;
  config?: MarketplaceCalendarData | MarketplaceWorkshopData;
  onChange: (
    calendarConfig: MarketplaceCalendarData | MarketplaceWorkshopData,
  ) => void;
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
      let newEstablishments: number[];
      let establishmentGroups: number[];

      if (key === 'establishmentGroups') {
        newEstablishments = values
          .flatMap((eg: EstablishmentGroup) => eg.establishment)
          .map((e: Establishment) => e.id);
      }
      if (key === 'establishments') {
        establishmentGroups = establishmentGroupList
          .filter((eg: EstablishmentGroup) =>
            (eg.establishment || [])
              .map((e: Establishment) => e.id)
              .every((e_id) => values.includes(e_id)),
          )
          .filter((group) => group.establishment.length !== 0);
      }
      const newConfig = {
        ...config,
        [key]: values.map((a: any) => a.id),
        establishments: newEstablishments,
        establishmentGroups,
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
        <Autocomplete
          multiple
          options={LEVELS}
          getOptionLabel={(option) => t(`level.${option.text}`)}
          value={LEVELS.filter(
            (l: any) => config.levels && props.config.levels.includes(l.id),
          )}
          onChange={(e, newValue) => setData('levels', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('common.level')}
              placeholder={t('common.level')}
            />
          )}
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
