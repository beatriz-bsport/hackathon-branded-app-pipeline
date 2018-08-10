import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import {
  TableRow,
  TableCell,
  Grid,
  Button,
  IconButton,
  Checkbox,
  Typography,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import { connect } from 'react-redux';

import { FeatureTable } from '../components';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export class Members extends Component<{}> {
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
      {
        id: 'phone',
        label: '',
      },
      {
        id: 'email',
        label: '',
      },
      {
        id: 'more',
        label: '',
      },
    ];
  };
  renderRow = (member, handleClick, isSelected) => {
    const { t } = this.props;
    const status = member.next_booking ? (
      <Typography color="primary">{member.next_booking}</Typography>
    ) : (
      <Typography color="error">
        {member.previous_booking || t('common.nothing')}
      </Typography>
    );
    return (
      <TableRow
        hover
        onClick={(event) => handleClick(event, member.id)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={member.id}
        selected={isSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected} />
        </TableCell>
        <TableCell component="th" scope="row">
          {member.name}
        </TableCell>
        <TableCell>{`${member.nb_bookings} ${t(
          'common.booking_s',
        ).toLowerCase()} - ${member.nb_pass_active} ${t(
          'common.pass',
        ).toLowerCase()}`}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{member.date_joined}</TableCell>
        <TableCell padding="dense">
          <IconButton>
            <CallIcon />
          </IconButton>
        </TableCell>
        <TableCell padding="none">
          <IconButton>
            <EmailIcon />
          </IconButton>
        </TableCell>
        <TableCell padding="dense">
          <Link to={`/member/${member.id}`} style={{ textDecoration: 'none' }}>
            <Button color="primary">{t('common.show_more')}</Button>
          </Link>
        </TableCell>
      </TableRow>
    );
  };
  render() {
    const { t, classes } = this.props;
    const { loading, members } = this.props;
    return (
      <Grid container direction="column" alignItems="stretch" spacing={16}>
        <Grid item xs={12}>
          <FeatureTable
            data={members}
            renderRow={this.renderRow}
            columnData={this.getColumnData()}
            loading={loading}
            title={t('common.members')}
            selectionFeature={
              <Tooltip title="Email">
                <Button variant="contained" className={classes.button}>
                  Email
                  <EmailIcon className={classes.rightIcon} />
                </Button>
              </Tooltip>
            }
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
    members: state.member.all.asMutable(),
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(Members)),
);
