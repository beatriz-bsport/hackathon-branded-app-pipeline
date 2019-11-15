// @flow
import React from 'react';
// import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
// import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { fetchContactList } from '../../libs/communication/actions';
import { getEmailContact } from '../../libs/communication/selectors';
import EmailTable from '../../libs/communication/components/EmailTable.component';
import type { EmailContact } from '../../libs/communication/types';

type Props = {
  id: number,
  contactList: Array<EmailContact>,
  count: number,
  loading: boolean,
  page: number,
  fetchContactList: (params: any) => void,
};

export const SmartListDetailEmail = (props: Props) => {
  return (
    <div>
      <EmailTable
        fetch={(params) =>
          props.fetchContactList({ ...params, smartlist: props.id })
        }
        contacts={props.contactList}
        count={props.count}
        page={props.page}
        loading={props.loading}
      />
    </div>
  );
};

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
