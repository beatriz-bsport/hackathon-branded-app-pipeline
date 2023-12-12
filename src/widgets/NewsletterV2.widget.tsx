import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { NewsletterFormBase } from 'bsport-saas/src/components/css-only/NewsletterFormV2';
import { NewsletterV2FieldsKind } from 'bsport-saas/src/libs/marketplace/constants';
import { createNewsletterMember } from 'bsport-saas/src/libs/marketing/api';
import {
  snackbarSuccess,
  snackbarError,
} from 'bsport-saas/src/libs/snackbar/actions';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { MarketplaceNewsletterV2Data } from 'bsport-saas/src/libs/marketplace/types';
import { OptionCallback } from 'bsport-saas/src/state/types';

const NewsletterFormV2Styled = themify(NewsletterFormBase);

type OwnProps = {
  config?: MarketplaceNewsletterV2Data,
  companyId: number,
};

type ConnectProps = typeof mapDispatchToProps;
type Props = OwnProps & ConnectProps;

export class NewsletterWidget extends Component<Props> {
  onSubmit = async (
    {
      email,
      first_name,
      last_name,
    }: {
      email: string,
      first_name: string,
      last_name: string,
    },
    options: OptionCallback,
  ) => {
    const res = await createNewsletterMember({
      email,
      first_name,
      last_name,
      company: this.props.companyId,
      ...(this.props.config?.tag_id
        ? { tag_id: this.props.config?.tag_id }
        : {}),
    });

    if (res.status === 200) {
      options?.onSuccess && options?.onSuccess?.();
      this.props.snackbarSuccess('marketing:newsletter.messages.success');
    } else {
      this.props.snackbarError('marketing:newsletter.messages.error');
    }
  };

  render() {
    return (
      <NewsletterFormV2Styled
        // @ts-expect-error
        fieldsType={
          this.props.config?.fieldsType ||
          NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL
        }
        title={this.props.config?.title}
        showTitle={this.props.config?.showTitle}
        subtitle={this.props.config?.subtitle}
        showSubtitle={this.props.config?.showSubtitle}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapDispatchToProps = {
  snackbarSuccess,
  snackbarError,
};

export default compose<Props, OwnProps>(connect(null, mapDispatchToProps))(
  NewsletterWidget,
);
