// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Redirect, Link } from 'react-router-dom';
import {
  TableRow,
  TableCell,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';

import { formatAsDatetime } from '../datetime';
import { FeatureTable } from '../components';
import type { Member } from '../api/types';

import { member as memberActions } from '../actions';

type Props = {
  onUpdateMember: (*) => void,
  t: (x: string) => string,
  loading: boolean,
  members: Array<Member>,
};

type State = {
  requestedRedirection: ?string,
};

export class Members extends Component<Props, State> {
  state = { requestedRedirection: null };

  getColumnData = () => {
    const { t } = this.props;
    return [
      {
        id: 'name',
        label: t('common.name'),
      },
      {
        id: 'offers_joined',
        label: t('member.engagement'),
      },
      {
        id: 'status',
        label: t('booking.lastBooking'),
      },
      {
        id: 'date_joined',
        label: t('member.date_joined'),
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
        onClick={() => this.redirectToMemberPage(member.id)}
        aria-checked={isSelected}
        tabIndex={-1}
        key={member.id}
        selected={isSelected}
      >
        <TableCell component="th" scope="row">
          {member.name}
        </TableCell>
        <TableCell>
          {`${member.nb_bookings} ${t('common.booking_s').toLowerCase()} - ${
            member.nb_pass_active
          } ${t('common.pass').toLowerCase()}`}
        </TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{member.date_joined}</TableCell>
        <TableCell>
          <Button onClick={() => this.props.onUpdateMember(member)}>
            Modifier
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  redirectToMemberPage = (memberId: number) => {
    this.setState({ requestedRedirection: `/member/${memberId}` });
  };

  render() {
    const { requestedRedirection } = this.state;
    const { t, loading, members } = this.props;

    if (requestedRedirection) {
      return <Redirect to={requestedRedirection} />;
    }

    const mutableMembers = members.asMutable ? members.asMutable() : members;
    return (
      <Grid container direction="column" alignItems="stretch" spacing={16}>
        <Grid item xs={12}>
          <FeatureTable
            data={mutableMembers}
            renderRow={this.renderRow}
            columnData={this.getColumnData()}
            loading={loading}
            title={t('common.members')}
          />
        </Grid>
        <Grid item>
          <Grid container justify="flex-end">
            <Grid item>
              <Link style={{ textDecoration: 'none' }} to="/member/add/">
                <Button variant="raised" color="primary">
                  {t('member.addMember')}
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.member.loading,
    members: state.member.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateMember(member) {
      dispatch(memberActions.startUpdate(member));
    },
  };
}

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(Members),
);
