import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MaterialStyleType } from '../../../utils/types';
import CustomColorButton from '../../../components/button/CustomColorButton.component';
import RedButton from '../../../components/button/RedButton.component';
import type { QuickbooksApp } from '../types';
import type { Theme as CompanyTheme } from '../../theme/types';

type OwnProps = {
  connectQuickbooks: () => void;
  revokeQuickBooks: () => void;
  theme: CompanyTheme;
  quickbooksApp: QuickbooksApp;
  onSubmitTheme: (theme: CompanyTheme) => void;
  loading: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const QuickBooksConfigurationForm = (props: Props) => {
  const { t, classes } = props;
  const { is_configured, is_disabled } = props?.quickbooksApp;
  return (
    <div>
      <Paper className={classes.paperContainer}>
        {props.loading && <LinearProgress color="primary" />}
        <div className={classes.inputContainer}>
          <Switch
            checked={props.theme.is_quickbook_integration_enabled}
            disabled={
              !is_configured ||
              !props.theme.is_quickbook_integration_allowed ||
              props.loading
            }
            value={!is_disabled}
            onChange={() => {
              props.onSubmitTheme(
                !props.theme.is_quickbook_integration_enabled,
              );
            }}
          />
          <Typography color={is_configured ? undefined : 'textSecondary'}>
            {t('quickbooks.enable')}
          </Typography>
        </div>
        <Typography style={{ marginBottom: 8 }} variant="caption">
          {t('quickbooks.explainEnable')}
        </Typography>
        <div className={classes.rowActions}>
          <CustomColorButton
            variant="contained"
            color="#00B223"
            disabled={
              !props.theme.is_quickbook_integration_allowed || props.loading
            }
            onClick={props.connectQuickbooks}
            style={{ color: 'white' }}
          >
            {is_configured ? (
              <>
                <RefreshIcon className={classes.iconLeft} />
                {t('quickbooks.buttonReConnect')}
              </>
            ) : (
              <>{t('quickbooks.buttonConnect')}</>
            )}
          </CustomColorButton>
          {is_configured && (
            <RedButton
              variant="contained"
              disabled={props.zoomLoading || props.loading}
              onClick={props.revokeQuickBooks}
            >
              {t('quickbooks.buttonRevoke')}
            </RedButton>
          )}
        </div>
      </Paper>
    </div>
  );
};
const styles = (theme: Theme) => ({
  horizontalInput: {
    marginRight: theme.spacing(3),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
  verticalInput: {
    marginBottom: theme.spacing(2),
  },
  explainContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: theme.spacing(2),
    alignItems: 'center',
  },
  subInputContainer: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  namesHeader: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paperContainer: {
    padding: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  rowActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
});
export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation('settings'),
)(QuickBooksConfigurationForm);
