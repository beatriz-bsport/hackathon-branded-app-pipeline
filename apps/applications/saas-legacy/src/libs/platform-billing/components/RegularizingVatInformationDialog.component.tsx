import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Typography } from '@material-ui/core';
import InfoBox from '#src/components/box/InfoBox.component';

type OwnProps = {
  goNext: () => void;
  cancel: () => void;
};

export const RegularizingVatInformationDialog: React.FC<OwnProps> = ({
  goNext,
  cancel,
}) => {
  const { t } = useTranslation(['platformBilling']);
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.title} variant="h5">
        {t(`platformCustomerEntity.vatId.alert.title`)}
      </Typography>
      <Typography className={classes.content}>
        {t(`platformCustomerEntity.vatId.alert.text`)}
      </Typography>
      <InfoBox
        className={classes.infoBox}
        content={t(`platformCustomerEntity.vatId.alert.description`)}
        variant="outlined"
      />
      <div className={classes.actions}>
        <div className={classes.actionsEnd}>
          {cancel && <Button onClick={cancel}>{t('common:close')}</Button>}
          <Button color="primary" onClick={goNext} variant="contained">
            {t(`platformCustomerEntity.vatId.alert.update`)}
          </Button>
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  infoBox: { margin: theme.spacing(4), marginBottom: '0' },
  title: { padding: theme.spacing(4) },
  content: { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
  actions: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(1),
  },
  actionsEnd: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));
export default RegularizingVatInformationDialog;
