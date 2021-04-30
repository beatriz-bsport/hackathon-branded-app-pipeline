import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import {
  emailDesignCreate,
  setEmailEditorHasBeenLoaded,
} from '../../libs/email-editor/actions';
import { Context } from '../../context';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../actions/snackbar.actions';

import { fetchTagList } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';
import { RootState } from '../../reducers';

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export class EmailTemplateCreate extends Component<Props> {
  componentWillMount() {
    if (this.props.hasBeenLoadedOnce) {
      window.location.reload();
    }
    if (!this.props.hasBeenLoadedOnce) {
      this.props.setHasBeenLoaded(true);
    }
  }

  componentDidMount() {
    this.props.fetchTagList();
    this.props.setHasBeenLoaded();
  }

  onSave = (id: number, data: any) => {
    this.props.emailDesignCreate(data, {
      onSuccess: (templateId: number) => {
        this.props.goToListDetail(templateId);
      },
    });
  };

  render() {
    return (
      <Context.Consumer>
        {(context: any) => (
          <EmailEditorPanel
            company_id={this.props.company_id}
            save_email={this.onSave}
            hideLeftMenuAction={context.hideLeftMenuAction}
            showLeftMenuAction={context.showLeftMenuAction}
            emailLoad=""
            tags={this.props.tagCategories}
            goToList={this.props.goToList}
            displayEmptyError={this.props.snackbarError}
          />
        )}
      </Context.Consumer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  company_id: state.theme.theme.company,
  tagCategories: getTagCategories(state),
  hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
});

const mapDispatchToProps = {
  fetchTagList,
  snackbarError,
  emailDesignCreate,
  setHasBeenLoaded: setEmailEditorHasBeenLoaded,
  goToList: () => push('/email-template'),
  goToListDetail: (id: number) => push(`/email-template/${id}`),
};

export default compose(
  withTranslation(['emailTemplate']),
  withTitle(({ t }: { t: TFunction }) => t('createTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(EmailTemplateCreate);
