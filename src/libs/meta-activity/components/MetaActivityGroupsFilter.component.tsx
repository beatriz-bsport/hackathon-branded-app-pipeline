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
        clearable
        className={classes.date}
        label={t('common.from')}
        onChange={(value: Moment) => {
          onChange({
            ...filter,
            min_date: value ? value.format('YYYY-MM-DD') : null,
          });
        }}
        value={filter.min_date ? moment(filter.min_date) : null}
      />
      <DateInput
        clearable
        className={classes.date}
        label={t('common.until')}
        onChange={(value: Moment) => {
          onChange({
            ...filter,
            max_date: value ? value.format('YYYY-MM-DD') : null,
          });
        }}
        value={filter.max_date ? moment(filter.max_date) : null}
      />
      {!withoutMetaActivity && (
        <div className={classes.selector}>
          <MetaActivitySelector
            closeMenuOnSelect
            isLoading={isLoading}
            metaActivities={metaActivities}
            selectedMetaActivities={filter.meta_activity__in}
            selectOption={(ev: { value: number }[]) => {
              onChange({
                ...filter,
                meta_activity__in: ev.map(({ value }) => value) ?? undefined,
              });
            }}
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
