// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import TypographyMultiline from '../../../components/TypographyMultiline.component';
import withConfirm from '../../../hocs/with-confirm.hoc';

import PrivateSlotEditableList from './PrivateSlotEditableList.component';
import PrivateCoachEditableList from './PrivateCoachEditableList.component';
import PrivateEstablishmentEditableList from './PrivateEstablishmentEditableList.component';

import type { PrivateService } from '../types';

type Props = {
  privateService: PrivateService,
  onEdit: () => void,
  onDelete: () => void,
  deletePrivateCoach: (coachId: number, privateServiceId: number) => void,
  createPrivateCoach: (
    serviceId: number,
    associatedCoachId: number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  coaches: Array<AssociatedCoach>,
  deletePrivateEstablishment: (
    associatedEstablishmentId: number,
    privateServiceId: number,
  ) => void,
  createPrivateEstablishment: (
    serviceId: number,
    associatedEstablishmentId: number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  establishments: Array<Establishment>,
  deletePrivateSlot: (any) => void,
  createOrUpdatePrivateSlot: (any) => void,

  t: TFunction,
  classes: Object,
};

const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton onClick={props.onClick} color="error">
    <DeleteIcon />
  </IconButton>
);

const DeleteButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'privateService:privateService.delete.title',
  cancel: 'privateService:privateService.delete.cancel',
  confirm: 'privateService:privateService.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('privateService:privateService.delete.explain')}</p>
  ),
});

export const PrivateServiceDetail = (props: Props) => {
  const { t, classes, privateService } = props;
  return (
    <Paper className={classes.paperContainer}>
      <Typography variant="h4" component="h3" className={classes.title}>
        {privateService.name}
      </Typography>
      <div className={classes.iconTopRight}>
        <IconButton onClick={props.onEdit} color="primary">
          <EditIcon />
        </IconButton>
        <DeleteButtonWithConfirm
          onClick={() => props.onDelete(privateService.id)}
        />
      </div>
      <Typography variant="h6" component="h4" className={classes.subtitle}>
        {t('service.parameters.description')}
      </Typography>
      <TypographyMultiline
        color="textSecondary"
        className={classes.description}
      >
        {privateService.description}
      </TypographyMultiline>
      <Typography variant="h6" component="h4" className={classes.subtitle}>
        {t('service.parameters.coaches.title')}
      </Typography>
      <PrivateCoachEditableList
        classes={classes}
        t={props.t}
        privateService={privateService}
        deletePrivateCoach={props.deletePrivateCoach}
        createPrivateCoach={props.createPrivateCoach}
        coaches={props.coaches}
      />
      <Typography variant="h6" component="h4" className={classes.subtitle}>
        {t('service.parameters.establishments.title')}
      </Typography>
      <PrivateEstablishmentEditableList
        classes={classes}
        t={props.t}
        privateService={privateService}
        deletePrivateEstablishment={props.deletePrivateEstablishment}
        createPrivateEstablishment={props.createPrivateEstablishment}
        establishments={props.establishments}
      />
      <Typography variant="h6" component="h4" className={classes.subtitle}>
        {t('service.parameters.slots.title')}
      </Typography>
      <PrivateSlotEditableList
        privateService={privateService}
        deletePrivateSlot={props.deletePrivateSlot}
        createPrivateSlot={props.createOrUpdatePrivateSlot}
        updatePrivateSlot={props.createOrUpdatePrivateSlot}
      />
    </Paper>
  );
};

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 2,
    position: 'relative',
  },
  iconTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  subtitle: {
    marginTop: theme.spacing.unit * 2,
  },
  description: {
    paddingLeft: theme.spacing.unit * 2,
  },
  warningEmptyList: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateServiceDetail);
