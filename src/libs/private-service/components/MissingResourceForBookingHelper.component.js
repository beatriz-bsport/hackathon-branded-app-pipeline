// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  missingResources: Array<string>,
  classes: Object,
  address: string,
  updateData: ({ address: string }) => void,
};
export const MissingResourceForBookingHelper = (props: Props) => {
  const { missingResources, t, classes, address } = props;
  return (
    <div>
      {missingResources.includes('address') ? (
        <TextField
          required
          variant="outlined"
          value={address || ''}
          fullWidth
          className={classes.addressField}
          multiline
          onChange={(ev) => props.updateData({ address: ev.target.value })}
          label={t('bookerModule.address.label')}
        />
      ) : null}
      {missingResources.includes('establishment') ? (
        <div className={classes.missingResourceContainer}>
          <LocationOnIcon color="error" className={classes.leftIcon} />
          <Typography>
            {t('bookerModule.missingResource.establishment')}
          </Typography>
        </div>
      ) : null}
      {missingResources.includes('coach') ? (
        <div className={classes.missingResourceContainer}>
          <PeopleIcon color="error" className={classes.leftIcon} />
          <Typography>{t('bookerModule.missingResource.coach')}</Typography>
        </div>
      ) : null}
      {missingResources.includes('private_service') ||
      missingResources.includes('private_slot') ? (
        <div className={classes.missingResourceContainer}>
          <InfoOutlineIcon color="error" className={classes.leftIcon} />
          <Typography variant="body2">
            {t('bookerModule.missingResource.service')}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

const styles = (theme) => ({
  missingResourceContainer: {
    marginTop: theme.spacing(2),

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    border: '1px solid #E2E2E2',
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  addressField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(MissingResourceForBookingHelper);
