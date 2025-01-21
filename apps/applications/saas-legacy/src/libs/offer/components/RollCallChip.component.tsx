import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlaylistAddCheck } from '@material-ui/icons';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { DateTime } from 'luxon';
import clsx from 'clsx';
import { ButtonBase } from '@material-ui/core';
import Tooltip from '#src/components/Tooltip.component';
import { formatISOStringAsTime } from '../../../utils/datetime';

export type Props = {
  isValidated: boolean;
  lastValidatedRollCallDate?: string;
  onClick: () => void;
};

export const RollCallChip: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('offer');
  const onClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.stopPropagation();
    props.onClick();
  };
  return (
    <ButtonBase onClick={onClick}>
      <Tooltip
        title={
          props.isValidated
            ? t('rollCall.chip.validatedRollCall', {
                date: DateTime.fromISO(
                  props.lastValidatedRollCallDate,
                ).toLocaleString(DateTime.DATE_SHORT),
                time: formatISOStringAsTime(props.lastValidatedRollCallDate),
              })
            : t('rollCall.chip.notValidatedRollCall')
        }
      >
        <div
          className={clsx(
            classes.chipStatus,
            props.isValidated
              ? classes.validatedChipStatus
              : classes.notValidatedChipStatus,
          )}
        >
          <PlaylistAddCheck fontSize="small" />
        </div>
      </Tooltip>
    </ButtonBase>
  );
};

const useStyles = makeStyles((theme) => ({
  chipStatus: {
    height: 22,
    width: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${theme.spacing(0.25)}px ${theme.spacing(0.75)}px`,
    borderRadius: theme.spacing(0.5),
  },
  validatedChipStatus: {
    color: theme.palette.success.main,
    backgroundColor: '#F1F9F1',
  },
  notValidatedChipStatus: {
    color: theme.palette.error.main,
    backgroundColor: '#FFF0EF',
  },
}));

export default RollCallChip;
