// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { PrivateBookingPreview } from '../../types';

type Props = {
  preview: PrivateBookingPreview,
  onAddressEdit?: () => void,
  address: ?string,
  credit_cost: number,
  t: TFunction,
  classes: Object,
};

export const PrivateBookingPreviewListItem = (props: Props) => {
  const date_start = moment(props.preview.date_start);
  const date_end = moment(props.preview.date_end);
  const address = props.preview.address || props.address;
  return (
    <React.Fragment>
      <Typography variant="h4" component="h2" className={props.classes.title}>
        {`${date_start.format('LLL')} - ${date_end.format('LT')}`}
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={props.preview.coach.photo} />
        </ListItemAvatar>
        <ListItemText
          primary={props.preview.title}
          secondary={props.preview.subtitle}
        />
        <ListItemIcon>
          {props.t('bookerModule.preview.credit_cost', {
            credit_cost: props.credit_cost,
          })}
        </ListItemIcon>
      </ListItem>
      {address ? (
        <div className={props.classes.addressContainer}>
          <Typography color="textSecondary">{address}</Typography>
          {props.onAddressEdit ? (
            <IconButton color="priamry" onClick={props.onAddressEdit}>
              <EditIcon />
            </IconButton>
          ) : null}
        </div>
      ) : null}
    </React.Fragment>
  );
};

const styles = (theme) => ({
  title: {
    marginBottom: theme.spacing(3),
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateBookingPreviewListItem);
