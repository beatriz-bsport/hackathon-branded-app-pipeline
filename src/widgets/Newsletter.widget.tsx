import React, { Component } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';

import {
  withStyles,
  createStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import type { WithStyles } from 'bsport-saas/node_modules/@material-ui/core/styles';
import NewsletterFormComponent from 'bsport-saas/src/libs/marketing/components/NewsletterForm.component';
import { createNewsletterMember } from 'bsport-saas/src/libs/marketing/api';
import {
  snackbarSuccess,
  snackbarError,
} from 'bsport-saas/src/libs/snackbar/actions';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { CompanyTheme } from 'bsport-saas/src/libs/theme/types';

const NewsletterFormComponentStyled = themify(NewsletterFormComponent);

type OwnProps = {
  companyId: number,
  theme: CompanyTheme,
};

type ConnectProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ConnectProps & WithStyles<typeof styles>;

interface State {
  showSuccessSnackbar: boolean;
}

export class NewsletterWidget extends Component<Props, State> {
  onSubmit = async (email: string, first_name: string, last_name: string) => {
    const res = await createNewsletterMember({
      email,
      first_name,
      last_name,
      company: this.props.companyId,
    });

    if (res.status === 200) {
      this.props.snackbarSuccess('marketing:newsletter.messages.success');
    } else {
      this.props.snackbarError('marketing:newsletter.messages.error');
    }
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <NewsletterFormComponentStyled
          onSubmit={this.onSubmit}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

const styles = () =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const mapDispatchToProps = {
  snackbarSuccess,
  snackbarError,
};

const connector = connect(null, mapDispatchToProps);

export default compose<any, OwnProps>(
  withStyles(styles),
  connector,
)(NewsletterWidget);
