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
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';

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
  renderRow = (member, handleClick, isSelected) => {
    const { t } = this.props;
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
        <TableCell>{member.offers_joined}</TableCell>
        <TableCell>{member.status}</TableCell>
        <TableCell>{member.date_joined}</TableCell>
        <TableCell padding="dense">
          <IconButton>
            <CallIcon />
          </IconButton>
        </TableCell>
        <TableCell padding="dense">
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
    const data = [
      {
        id: 1,
        name: 'Jean Jacques',
        date_joined: '21/07/1998',
        offers_joined: '5 séances (0 pass actif)',
        status: 'Séance dans 2h',
      },
      {
        id: 2,
        name: 'Marie Paul',
        date_joined: '24/12/2017',
        offers_joined: '0 séance (1 pass actif)',
        status: 'Inactif depuis 6 mois',
      },
    ];
    const columnData = [
      {
        id: 'name',
        label: t('common.name'),
      },
      {
        id: 'offers_joined',
        label: t('member.offers_joined'),
      },
      {
        id: 'status',
        label: t('common.status'),
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
    return (
      <FeatureTable
        data={data}
        renderRow={this.renderRow}
        columnData={columnData}
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
    );
  }
}

export default withStyles(styles)(translate()(Members));
