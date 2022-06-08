import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Chip from '@material-ui/core/Chip';

import { ReportMetadataColumn } from '../types';

type Props = {
  value: string[];
  onChange: (columns: string[]) => void;
  columns: ReportMetadataColumn[];
};

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const ReportColumnSelector: React.FC<Props> = ({
  columns,
  value,
  onChange,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');

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
};

export default ReportColumnSelector;
