import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import { MaterialStyleType } from '../../../utils/types';
import type { CustomForm } from '../types';

type OwnProps = {
  navigateTo: () => void;
  customForm: CustomForm;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const CustomFormConfigurationBanner = (props: Props) => {
  const { t, classes, customForm } = props;
  if (customForm?.is_signup || customForm?.is_member_form) {
    return (
      <div className={classes.OutterContainer}>
        <div className={classes.helperContainer}>
          <InfoOutlinedIcon className={classes.infoIcon} />
          <Typography variant="caption">
            {customForm?.is_signup
              ? t('customForm.signupFormHelper')
              : t('customForm.memberFormHelper')}
          </Typography>
        </div>
        <Button variant="outlined" onClick={props.navigateTo}>
          {customForm?.is_signup
            ? t('customForm.navigateToMemberForm')
            : t('customForm.navigateToSignup')}
        </Button>
      </div>
    );
  }

  return null;
};
const styles = (theme: Theme) => ({
  OutterContainer: {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[700]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  helperContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  infoIcon: {
    marginRight: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormConfigurationBanner);
