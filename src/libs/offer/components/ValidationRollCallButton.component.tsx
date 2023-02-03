import React from 'react';
import { PlaylistAddCheck } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

export type Props = { nbRollCallsLeftToValidate?: number; outlined?: boolean };

export const ValidationRollCallButton: React.FC<Props> = (props) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();
  return (
    <Button
      color="primary"
      variant={props.outlined ? 'outlined' : 'contained'}
      disabled={props.nbRollCallsLeftToValidate === 0}
    >
      <PlaylistAddCheck className={classes.iconLeft} />
      {t('rollCall.button.validationRollCall', {
        count: props.nbRollCallsLeftToValidate,
      })}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

ValidationRollCallButton.defaultProps = {
  nbRollCallsLeftToValidate: 1,
  outlined: false,
};

export default ValidationRollCallButton;
