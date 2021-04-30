import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  emailSummary?: EmailTemplateSummary;
  emailDetails?: EmailTemplateDetail;
  loading: boolean;
  onClickEdit: () => void;
  onClickRemove: () => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class EmailTemplateForNotifications extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.container}>
        {this.props.emailSummary &&
        this.props.emailDetails &&
        !this.props.loading ? (
          <div>
            <div className={classes.actionsContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.props.onClickEdit}
              >
                {t('notifications.editRule')}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                className={classes.removeContainer}
                onClick={this.props.onClickRemove}
              >
                {t('notifications.removeRule')}
              </Button>
            </div>

            <Typography variant="h5" className={classes.emailSummary}>
              {this.props.emailSummary.subject}
            </Typography>
            <div className={classes.mailPreview}>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.emailDetails.html,
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            {this.props.loading ? (
              <CircularProgress />
            ) : (
              <div className={classes.selectRulesContainer}>
                <InfoIcon />
                <Typography className={classes.marginTop}>
                  {t('marketing:notifications.selectNotificationRules')}
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  actionsContainer: {
    display: 'flex',
  },
  removeContainer: {
    marginLeft: theme.spacing(2),
  },
  emailSummary: {
    width: '100%',
    marginTop: theme.spacing(4),
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
    paddingTop: theme.spacing(2),
  },
  mailPreview: {
    marginTop: theme.spacing(2),
    width: '100%',
    maxHeight: '50vh',
  },
  selectRulesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['marketing']),
)(EmailTemplateForNotifications);
