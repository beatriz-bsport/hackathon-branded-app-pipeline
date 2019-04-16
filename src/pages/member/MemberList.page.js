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

import { formatAsDate, formatAsDatetime } from '../../datetime';
import { FeatureTable } from '../../components';
import type { Member } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import withBottomButtons from '../../hocs/inject-bottom-buttons';

type Props = {
  t: TFunction,
  loading: boolean,
  members: Array<Member>,
  goToMemberDetail: (memberId: number) => void,
};

export class Members extends Component<Props> {
  getColumnData = () => {
    const { t } = this.props;
    return [
      {
        id: 'name',
        label: t('common.name'),
        sortable: true,
      },
      {
        id: 'status',
        label: t('booking.lastBooking'),
        sortable: true,
      },
      {
        id: 'date_joined',
        label: t('member.date_joined'),
        sortable: true,
      },
      {
        id: 'actions',
        label: t('member.row.headers.actions'),
      },
    ];
  };

  renderRow = (
    member: Member,
    handleClick: () => void,
    isSelected: boolean,
  ) => {
    const { t } = this.props;
    const status = member.next_booking ? (
      <Typography color="primary">
        {formatAsDatetime(member.next_booking)}
      </Typography>
    ) : (
      <Typography color="error">
        {member.previous_booking
          ? formatAsDatetime(member.previous_booking)
          : t('common.nothing')}
      </Typography>
    );
    return (
      <TableRow
        hover
        onClick={() => this.props.goToMemberDetail(member.id)}
        aria-checked={isSelected}
        tabIndex={-1}
        key={member.id}
        selected={isSelected}
      >
        <TableCell component="th" scope="row">
          {member.name}
        </TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{formatAsDate(member.date_joined)}</TableCell>
        <TableCell>
          <Button
            onClick={() => this.props.goToMemberDetail(member.id)}
            color="primary"
          >
            {t('common.show')}
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { loading, members } = this.props;

    const mutableMembers = members.asMutable ? members.asMutable() : members;
    return (
      <Grid container direction="row" spacing={32}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <FeatureTable
              data={mutableMembers}
              order="desc"
              orderBy="date_joined"
              renderRow={this.renderRow}
              columnData={this.getColumnData()}
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
      goToMemberDetail: (id: number) => push(`/member/${id}`),
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/member/add',
      text: i18next.t('member.addMember'),
    },
  }),
)(Members);
