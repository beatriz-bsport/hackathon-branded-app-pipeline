import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlaylistAddCheck } from '@material-ui/icons';
import makeStyles from '@material-ui/core/styles/makeStyles';
import chroma from 'chroma-js';
import moment from 'moment-timezone';
import classNames from 'classnames';
import Tooltip from '#components/Tooltip.component';

export type Props = {
  isValidated: boolean;
  lastValidatedRollCallDate?: string;
};

export const RollCallChip: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('offer');
  return (
    <Tooltip
      title={
        props.isValidated
          ? t('rollCall.chip.validatedRollCall', {
              date: moment(props.lastValidatedRollCallDate).format('L'),
              time: moment(props.lastValidatedRollCallDate).format('LT'),
            })
          : t('rollCall.chip.notValidatedRollCall')
      }
    >
      <div
        className={classNames(
          classes.chipStatus,
          props.isValidated
            ? classes.validatedChipStatus
            : classes.notValidatedChipStatus,
        )}
      >
        <PlaylistAddCheck />
      </div>
    </Tooltip>
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
    backgroundColor: chroma(theme.palette.success.main).alpha(0.1).hex(),
  },
  notValidatedChipStatus: {
    color: theme.palette.error.main,
    backgroundColor: chroma(theme.palette.error.main).alpha(0.1).hex(),
  },
}));

export default RollCallChip;
