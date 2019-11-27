// @flow
import React, { Component } from 'react';
// import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
// import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { fetchContactList } from '../../libs/communication/actions';
import { getEmailContact } from '../../libs/communication/selectors';
import EmailTable from '../../libs/communication/components/EmailTable.component';
import type { EmailContact } from '../../libs/communication/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  id: number,
  contactList: Array<EmailContact>,
  count: number,
  loading: boolean,
  page: number,
  fetchContactList: (params: any) => void,
};

export class SmartListDetailEmail extends Component<Props, state> {
  state = {
    selectedPreview: false,
  };

  render() {
    const { contactList, count, page, loading } = this.props;
    return (
      <div>
        <EmailTable
          fetch={(params) =>
            this.props.fetchContactList({ ...params, smartlist: this.props.id })
          }
          contacts={contactList}
          count={count}
          page={page}
          loading={loading}
          displayMailPreview={(id) => this.setState({ selectedPreview: id })}
        />
        <Dialog open={this.state.selectedPreview}>
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: contactList.find(
                  (contact) => contact.member.id === this.state.selectedPreview,
                )
                  ? contactList.find(
                      (contact) =>
                        contact.member.id === this.state.selectedPreview,
                    ).data.body
                  : null,
              }}
            />
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ selectedPreview: null });
              }}
            >
              {'Annuler'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// const styles = (theme) => ({});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withNamespaces(['communication']),
  // withStyles(styles),
  connect(
    (state) => ({
      contactList: getEmailContact(state),
      loading: state.communication.emailContact.loading,
      error: state.communication.emailContact.error,
      page: state.communication.emailContact.page,
      count: state.communication.emailContact.count,
    }),
    {
      fetchContactList,
    },
  ),
)(SmartListDetailEmail);
