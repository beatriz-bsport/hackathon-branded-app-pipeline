import React from 'react';
import uniq from 'lodash/uniq';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Chip from '@material-ui/core/Chip';

import IconButton from '@material-ui/core/IconButton';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Typography from '@material-ui/core/Typography';
import Tooltip from '#components/Tooltip.component';
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
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  const allSelected = columns?.every((_col) => value.includes(_col.identifier));
  return (
    <>
      <div className={classes.flexRow}>
        <Typography variant="body2">{t('form.columns')}</Typography>
        <Tooltip
          title={
            allSelected ? t('columns.unSelectAll') : t('columns.selectAll')
          }
        >
          <IconButton
            color="primary"
            onClick={() =>
              onChange(
                allSelected
                  ? []
                  : uniq(
                      value.concat(uniq(columns?.map((col) => col.identifier))),
                    ),
              )
            }
          >
            {allSelected ? (
              <HighlightOffIcon fontSize="small" />
            ) : (
              <AllInclusiveIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </div>
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
    </>
  );
};

export default ReportColumnSelector;
