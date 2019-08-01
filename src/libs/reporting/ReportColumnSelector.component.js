// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';

import type { ReportMetadataColumn } from './types';

type Props = {
  value: string[],
  onChange: (string[]) => void,
  columns: ReportMetadataColumn[],
  classes: { [string]: string },
  t: TFunction,
};

const styles = (theme) => ({
  chip: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

export function ReportColumnSelector(props: Props) {
  const { columns, value, classes, onChange, t } = props;
  return (
    <div>
      {columns.map(({ identifier }) => {
        const isSelected = (value || []).includes(identifier);
        const color = isSelected ? 'primary' : 'default';
        const onDelete = isSelected
          ? () => onChange(value.filter((c) => c !== identifier))
          : null;
        const onClick = isSelected
          ? onDelete
          : () => onChange(value.concat([identifier]));
        return (
          <Chip
            key={identifier}
            label={t(`columns.${identifier}`)}
            color={color}
            className={classes.chip}
            onDelete={onDelete}
            onClick={onClick}
            clickable
          />
        );
      })}
    </div>
  );
}

export default withStyles(styles)(
  withNamespaces(['reporting'])(ReportColumnSelector),
);
