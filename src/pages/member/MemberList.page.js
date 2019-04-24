// @flow

import React from 'react';
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
import { memberFetcher } from '../../actions';

type Props = {
  t: TFunction,
  loading: boolean,
  members: Array<Member>,
  goToMemberPage: (memberId: number) => void,
  fetchMember: (id: number) => void,
  detailedMembers: Array<MemberDetailed>,
};
const getColumnData = (t) => {
  return [
    {
      id: 'name',
      label: t('common.name'),
      sortable: true,
    },
    {
      id: 'date_joined',
      label: t('member.date_joined'),
      sortable: true,
    },
    {
      id: 'status',
      label: t('booking.lastBooking'),
      sortable: true,
    },
    {
      id: 'actions',
      label: t('member.row.headers.actions'),
    },
  ];
};
const renderRow = (t, fetchMember, detailedMembers, goToMemberPage) => (
  member: Member,
  handleClick: () => void,
  isSelected: boolean,
) => {
  fetchMember(member.id);

  const detailedMember = detailedMembers.find((m) => m.id === member.id);
  let status = <Typography> - </Typography>;
  const date_joined = detailedMember
    ? formatAsDate(detailedMember.date_joined)
    : '  -  ';

  if (detailedMember) {
    status = detailedMember.next_booking ? (
      <Typography color="primary">
        {formatAsDatetime(detailedMember.next_booking)}
      </Typography>
    ) : (
      <Typography color="error">
        {detailedMember.previous_booking
          ? formatAsDatetime(detailedMember.previous_booking)
          : t('common.nothing')}
      </Typography>
    );
  }
  return (
    <TableRow
      hover
      onClick={() => goToMemberPage(member.id)}
      aria-checked={isSelected}
      tabIndex={-1}
      key={member.id}
      selected={isSelected}
    >
      <TableCell component="th" scope="row">
        {member.name}
      </TableCell>
      <TableCell>{date_joined}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        <Button onClick={() => goToMemberPage(member.id)} color="primary">
          {t('common.show')}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export function Members(props: Props) {
  const {
    loading,
    members,
    t,
    fetchMember,
    detailedMembers,
    goToMemberPage,
  } = props;

  const mutableMembers = members.asMutable ? members.asMutable() : members;

  return (
    <Grid container direction="row" spacing={32}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <FeatureTable
            data={mutableMembers}
            order="desc"
            orderBy="date_joined"
            renderRow={renderRow(
              t,
              fetchMember,
              detailedMembers,
              goToMemberPage,
            )}
            columnData={getColumnData(props.t)}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default compose(
  withNamespaces(),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.members')),
  connect(
    (state) => ({
      loading: state.member.loading,
      members: state.member.all,
      detailedMembers: state.memberFetcher.details,
    }),
    {
      goToMemberPage: (id: number) => push(`/member/${id}`),
      fetchMember: memberFetcher.fetchIfOld,
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/member/add',
      text: i18next.t('member.addMember'),
    },
  }),
)(Members);
