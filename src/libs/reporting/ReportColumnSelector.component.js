// @flow

import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import type { ReportMetadataColumn } from './types';

type Props = {
  value: string[],
  onChange: (string[]) => void,
  columns: ReportMetadataColumn[],
  classes: { [string]: string },
};

const styles = (theme) => ({
  chip: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)((props: Props) => {
  const { columns, value, classes, onChange } = props;
  return (
    <div>
      {columns.map(({ identifier, name }) => {
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
            label={name}
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
});
