import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import {
  CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND,
  CHANGE_EMAIL_REQUEST_SIMPLE_EMAIL_CONFIRMATION_KIND,
} from '@bsport/common/lib/master-data/change-email-request';
import { MaterialStyleType } from '../../../../utils/types';
import { ChangeEmailRequest } from '#libs/member/types';
import { CompanyTheme } from '#libs/theme/types';

type OwnProps = {
  open: boolean;
  request: ChangeEmailRequest;
  accepted: boolean;
  denied: boolean;
  old_email: string;
  new_email: string;
  member_id: number;
  companyTheme: CompanyTheme;
  goToUserSpace: () => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const ChangeEmailSubmitDialog = (props: Props) => {
  const {
    t,
    classes,
    open,
    request,
    accepted,
    denied,
    old_email,
    new_email,
    member_id,
    companyTheme,
  } = props;
  const renderTitle = () => {
    if (request?.kind === CHANGE_EMAIL_REQUEST_SIMPLE_EMAIL_CONFIRMATION_KIND) {
      if (accepted) {
        return t(
          'changeEmailRequest.memberPage.simpleEmailChange.submit.acceptedTitle',
        );
      }
      return t(
        'changeEmailRequest.memberPage.simpleEmailChange.submit.deniedTitle',
      );
    }
    if (
      request.kind === CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND &&
      request.src_company_member === member_id
    ) {
      return t('changeEmailRequest.memberPage.linkAccount.submit.denied.title');
    }
    if (
      request.kind === CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND &&
      request.src_company_member !== member_id
    ) {
      if (accepted) {
        return t(
          'changeEmailRequest.memberPage.linkAccount.submit.accepted.title',
        );
      }
      return t('changeEmailRequest.memberPage.linkAccount.submit.denied.title');
    }
    return null;
  };

  const renderContent = () => {
    if (request?.kind === CHANGE_EMAIL_REQUEST_SIMPLE_EMAIL_CONFIRMATION_KIND) {
      if (accepted) {
        return t(
          'changeEmailRequest.memberPage.simpleEmailChange.submit.emailUpatedTo',
          {
            email: new_email,
          },
        );
      }
      return t(
        'changeEmailRequest.memberPage.simpleEmailChange.submit.emailPreservedTo',
        {
          email: old_email,
        },
      );
    }
    if (
      request.kind === CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND &&
      request.src_company_member === member_id
    ) {
      if (denied) {
        return t(
          'changeEmailRequest.memberPage.linkAccount.submit.denied.content',
          {
            old_email,
            new_email,
          },
        );
      }
    }
    if (
      request.kind === CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND &&
      request.src_company_member !== member_id
    ) {
      if (denied) {
        return t(
          'changeEmailRequest.memberPage.linkAccount.submit.denied.content',
          {
            old_email: new_email,
            new_email: old_email,
            company: companyTheme?.company_name,
          },
        );
      }
      return t(
        'changeEmailRequest.memberPage.linkAccount.submit.denied.content',
        {
          old_email,
          new_email,
          company: companyTheme?.company_name,
        },
      );
    }
    return null;
  };
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className={classes.title}>
          <Typography>{renderTitle()}</Typography>
          <div className={classes.doneIconContainer}>
            <DoneIcon className={classes.doneIcon} />
          </div>
        </div>
      </DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={props.goToUserSpace}
        >
          {t('changeEmailRequest.memberPage.actions.continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const styles = (theme: Theme) => ({
  title: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneIcon: {
    color: 'green',
  },
  cancelIcon: {
    color: 'red',
  },
  doneIconContainer: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
  },
});
export default compose<any, OwnProps>(
  withTranslation('member'),
  withStyles(styles),
)(ChangeEmailSubmitDialog);
