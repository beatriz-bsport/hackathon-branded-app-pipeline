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
  const setData = useCallback(
    (key: keyof MarketplaceCommonFilter, values: any) => {
      const config = {
        ...props.config,
        [key]: values.map((a: any) => a.id),
      };
      if (key === 'establishmentGroups') {
        config.establishments = values
          .flatMap((eg: EstablishmentGroup) => eg.establishment)
          .map((e: Establishment) => e.id);
      }
      if (key === 'establishments') {
        config.establishmentGroups = props.establishmentGroupList
          .filter((eg: EstablishmentGroup) =>
            (eg.establishment || [])
              .map((e: Establishment) => e.id)
              .every((e_id) => values.includes(e_id)),
          )
          .filter((group) => group.establishment.length !== 0);
      }
      props.onChange(config);
    },
    [props.config, props.establishmentGroupList],
  );

  const classes = useStyles();
  const { t } = useTranslation();

  if (!props.config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      <div className={classes.marginTop}>
        <Autocomplete
          multiple
          options={[...props.coaches]}
          getOptionLabel={(option) => option.name}
          value={[
            ...props.coaches.filter(
              (c) =>
                props.config.coaches && props.config.coaches.includes(c.id),
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
      {!!props.establishmentGroupList && (
        <div className={classes.marginTop}>
          <Autocomplete
            multiple
            options={[...props.establishmentGroupList]}
            getOptionLabel={(option) => option.name}
            value={[
              ...props.establishmentGroupList.filter(
                (l) =>
                  props.config.establishmentGroups &&
                  props.config.establishmentGroups.includes(l.id),
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
          options={[...props.establishments]}
          getOptionLabel={(option) => option.title}
          value={[
            ...props.establishments.filter(
              (e) =>
                props.config.establishments &&
                props.config.establishments.includes(e.id),
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
          options={[...props.metaActivities]}
          getOptionLabel={(option) => option.name}
          value={[
            ...props.metaActivities.filter(
              (m) =>
                props.config.metaActivities &&
                props.config.metaActivities.includes(m.id),
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
            (l: any) =>
              props.config.levels && props.config.levels.includes(l.id),
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
