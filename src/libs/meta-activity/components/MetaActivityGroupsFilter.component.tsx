// @ts-nocheck
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';

import MetaActivitySelector from './MetaActivitySelector.component';
import DateInput from '#components/input/DateInput.component';

import { OffersGroupFilter, MetaActivity } from '../types';

type Props = {
  filter: OffersGroupFilter;
  metaActivities: MetaActivity[];
  isLoading: boolean;
  withoutMetaActivity: boolean;
  onChange: (value: OffersGroupFilter) => void;
};

const MetaActivityGroupsFilter: React.FC<Props> = ({
  metaActivities = [],
  filter = {},
  isLoading = false,
  withoutMetaActivity = false,
  onChange,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <DateInput
        label={t('common.from')}
        value={filter.min_date ? moment(filter.min_date) : null}
        onChange={(value: Moment) => {
          onChange({
            ...filter,
            min_date: value ? value.format('YYYY-MM-DD') : null,
          });
        }}
        clearable
        className={classes.date}
      />
      <DateInput
        label={t('common.until')}
        value={filter.max_date ? moment(filter.max_date) : null}
        onChange={(value: Moment) => {
          onChange({
            ...filter,
            max_date: value ? value.format('YYYY-MM-DD') : null,
          });
        }}
        clearable
        className={classes.date}
      />
      {!withoutMetaActivity && (
        <div className={classes.selector}>
          <MetaActivitySelector
            metaActivities={metaActivities}
            closeMenuOnSelect
            selectedMetaActivities={filter.meta_activity__in}
            selectOption={(ev: { value: number }[]) => {
              onChange({
                ...filter,
                meta_activity__in: ev.map(({ value }) => value) ?? undefined,
              });
            }}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
  },
  selector: {
    minWidth: 200,
    flex: 2,
  },
  date: {
    flex: 1,
  },
}));

export default React.memo(MetaActivityGroupsFilter);
