// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import i18next from 'i18next';
import {
  TableRow,
  TableCell,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { member as memberActions } from '../../actions';
import { formatAsDate } from '../../datetime';
import { FeatureTable } from '../../components';
import type { Member } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import withBottomButtons from '../../hocs/inject-bottom-buttons';

type Props = {
  t: TFunction,
  loading: boolean,
  members: Array<Member>,
  goToMemberPage: (memberId: number) => void,
};
const getColumnData = (t) => {
  return [
    {
      id: 'name',
      label: t('common.name'),
      sortable: true,
      dataType: 'text',
    },
    {
      id: 'date_joined',
      label: t('member.date_joined'),
      sortable: true,
    },
    {
      id: 'credit_account_balance',
      label: t('member.creditAccountBalance'),
      sortable: true,
    },
    {
      id: 'actions',
      label: t('member.row.headers.actions'),
    },
  ];
};
const renderRow = (t, goToMemberPage) => (
  member: Member,
  handleClick: () => void,
  isSelected: boolean,
) => {
  const { credit_account_balance, date_joined, name, id } = member;
  const credit = credit_account_balance || 0;
  return (
    <TableRow
      hover
      onClick={() => goToMemberPage(id)}
      aria-checked={isSelected}
      tabIndex={-1}
      key={id}
      selected={isSelected}
    >
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell>{formatAsDate(date_joined)}</TableCell>
      <TableCell>
        <Typography color={credit >= 0 ? 'primary' : 'error'}>
          {credit.toFixed(2)} €
        </Typography>
      </TableCell>
      <TableCell>
        <Button onClick={() => goToMemberPage(id)} color="primary">
          {t('common.show')}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export class Members extends Component<Props> {
  componentDidMount() {
    this.props.refresh();
  }

  render() {
    const { loading, members, t, goToMemberPage } = this.props;

    const mutableMembers = members.asMutable ? members.asMutable() : members;

    return (
      <Grid container direction="row" spacing={32}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <FeatureTable
              data={mutableMembers}
              order="desc"
              orderBy="date_joined"
              renderRow={renderRow(t, goToMemberPage)}
              columnData={getColumnData(t)}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withNamespaces(),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.members')),
  connect(
    (state) => ({
      loading: state.member.loading,
      members: state.member.all,
    }),
    {
      goToMemberPage: (id: number) => push(`/member/${id}`),
      refresh: memberActions.refresher,
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/member/add',
      text: i18next.t('member.addMember'),
    },
  }),
)(Members);
