// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

type Props = {
  onAdd: () => void;
};

export const CadenceManagerFab: React.FC<Props> = ({ onAdd }) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <div className={classes.bottomButtonContainer}>
      <Fab color="primary" variant="extended" onClick={onAdd}>
        <AddIcon className={classes.leftIcon} />
        {t('cadence.form.addACadence')}
      </Fab>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  bottomButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default CadenceManagerFab;
