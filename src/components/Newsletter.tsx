import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import { withStyles } from '@material-ui/core';
import NewsletterFormComponent from 'bsport-saas/src/libs/marketing/components/NewsletterForm.component';
import { createNewsletterMember } from 'bsport-saas/src/libs/marketing/api';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { snackbarSuccess, snackbarError } from 'bsport-saas/src/actions/snackbar.actions';

type OwnProps = {
  companyId: number
  compactMode: any;
}

type ConnectProps = ReturnType<typeof mapStateToProps>
  & typeof mapDispatchToProps;

type Props = OwnProps & ConnectProps &
  ReturnType<typeof mapWithProps> & {
} & MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  showSuccessSnackbar: boolean
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
      this.props.success("marketing:newsletter.messages.success");
    } else {
      this.props.error("marketing:newsletter.messages.error");
    }
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <NewsletterFormComponent onSubmit={this.onSubmit} />
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
  success: (s: string) => snackbarSuccess(s),
  error: (s: string) => snackbarError(s),
};

const mapWithProps = () => ({});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withProps(mapWithProps)
)(NewsletterWidget);
