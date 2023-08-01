import React from 'react';

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import Typography from '@material-ui/core/Typography';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import Radio from '@material-ui/core/Radio';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import useCadenceFormStyles from '../hooks/styles.hook';

import { FormikValues } from './index';

type Props = {
  withExit: boolean;
};

export const ExitConfigurationSection: React.FC<Props> = ({ withExit }) => {
  const { t } = useTranslation('marketing');
  const classes = useCadenceFormStyles();

  const { values, setFieldValue }: FormikValues = useFormikContext();

  const handleSwitchToExitSuccess = () => {
    setFieldValue('is_exit_success', true);
    setFieldValue('is_exit_fail', false);
  };

  const handleSwitchToExitFail = () => {
    setFieldValue('is_exit_fail', true);
    setFieldValue('is_exit_success', false);
  };

  if (!withExit) {
    return null;
  }

  return (
    <div>
      <div className={classes.titleWithIcon}>
        <OfflineBoltIcon className={classes.icon} />
        <Typography variant="h6">{t('cadence.form.exit.title')}</Typography>
      </div>

      <div className={classes.paddingLeft2}>
        <FormGroup>
          <FormControlLabel
            control={
              <Radio
                checked={!!values.is_exit_success}
                onClick={handleSwitchToExitSuccess}
              />
            }
            id="is_exit_success_radio"
            label={t('cadence.form.exit.exit_success_label')}
          />
          <FormControlLabel
            control={
              <Radio
                checked={!!values.is_exit_fail}
                onClick={handleSwitchToExitFail}
              />
            }
            id="is_exit_fail_radio"
            label={t('cadence.form.exit.exit_fail_label')}
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default ExitConfigurationSection;
