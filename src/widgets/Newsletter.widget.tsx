import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import NewsletterFormComponent from 'bsport-saas/src/libs/marketing/components/NewsletterForm.component';
import { createNewsletterMember } from 'bsport-saas/src/libs/marketing/api';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import {
  snackbarSuccess,
  snackbarError,
} from 'bsport-saas/src/libs/snackbar/actions';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

const NewsletterFormComponentStyled = themify(NewsletterFormComponent);

type OwnProps = {
  companyId: number,
  theme: Theme,
};

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectProps &
  MaterialStyleType<ReturnType<typeof styles>>;

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

const styles = () => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  snackbarSuccess,
  snackbarError,
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(NewsletterWidget);
