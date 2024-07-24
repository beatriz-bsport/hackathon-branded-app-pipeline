import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';

type Props = { addUnitDisabled: boolean; handleAddUnit: () => void };

const WellhubConfigurationFooter: React.FC<Props> = ({
  addUnitDisabled,
  handleAddUnit,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <Button
        color="primary"
        disabled={addUnitDisabled}
        onClick={handleAddUnit}
        variant="contained"
      >
        <div className={classes.content}>
          <AddIcon />
          <Typography variant="button">
            {t('wellhub.configuration.panel.footer.addUnitButton')}
          </Typography>
        </div>
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  footer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default React.memo(WellhubConfigurationFooter);
