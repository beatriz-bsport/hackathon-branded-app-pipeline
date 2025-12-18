import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { PartnershipDisplayConfig } from '#src/libs/partnership/types';

type Props = {
  displayConfig: PartnershipDisplayConfig;
  addConnectionDisabled: boolean;
  onAddConnection: () => void;
};

const PartnershipConfigurationFooter: React.FC<Props> = ({
  displayConfig,
  addConnectionDisabled,
  onAddConnection,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <Button
        color="primary"
        disabled={addConnectionDisabled}
        onClick={onAddConnection}
        variant="contained"
      >
        <div className={classes.content}>
          <AddIcon />
          <Typography variant="button">
            {/*TODO: Rename translation*/}
            {t(
              `${displayConfig.partnershipIdentifier}.configuration.panel.footer.addUnitButton`,
            )}
          </Typography>
        </div>
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  footer: {
    alignItems: 'flex-end',
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

export default React.memo(PartnershipConfigurationFooter);
