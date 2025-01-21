// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import WarningIcon from '@material-ui/icons/Warning';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import withStyles from '@material-ui/core/styles/withStyles';
import Alert from '@material-ui/lab/Alert';

import { withTranslation, TFunction } from 'react-i18next';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import PrivateSlotForm from './PrivateSlotForm.component';
import PrivateSlotListItem from './PrivateSlotListItem.component';
import { CLASSPASS_COMPATIBLE_BOOKING_INTERVALS } from '#src/libs/private-service/constants';

import type { PrivateService } from '../../types';

type Props = {
  privateService: PrivateService,
  setOpenSlotForm: (boolean) => void,
  openSlotForm: boolean,
  editSlotForm: PrivatSlotData,
  setEditSlotForm: (privateSlot?: PrivateSlotData) => void,
  createPrivateSlot: (
    privateServiceId: number,
    data: PrivateSlotData,
    id?: number,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  updatePrivateSlot: (
    privateServiceId: number,
    data: PrivateSlotData,
    id?: number,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  deletePrivateSlot: (slotId: number) => void,

  t: TFunction,
  classes: Object,
};

export const PrivateSlotEditableList: React.FC<Props> = (props) => {
  const slots = props.privateService.slots.filter((s) => s.available);

  const { deletePrivateSlot, setEditSlotForm, privateService } = props;

  const showSessionsNotCompatibleWithPartnershipAlert = React.useMemo(
    () =>
      slots.some(
        (slot) =>
          slot.people_capacity_used !== 1 ||
          !CLASSPASS_COMPATIBLE_BOOKING_INTERVALS.includes(
            slot.booking_interval_minutes,
          ),
      ) && privateService.available_on_partnership,
    [slots, privateService.available_on_partnership],
  );

  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'session.privateSlot.allowed_actions.create',
        'session.privateSlot.allowed_actions.edit',
        'session.privateSlot.allowed_actions.delete',
      ]}
    >
      {([
        hasCreatePermission,
        hasEditPermission,
        hasDeletePermission,
      ]: boolean[]) => (
        <div className={props.classes.container}>
          <div className={props.classes.titleAlertContainer}>
            <div className={props.classes.titleRow}>
              <AccessTimeIcon
                className={props.classes.leftIcon}
                fontSize="large"
              />
              <Typography variant="h4">
                {props.t('service.configuration.slot')}
              </Typography>
            </div>
            {showSessionsNotCompatibleWithPartnershipAlert && (
              <Alert className={props.classes.alertContainer} severity="error">
                {props.t(
                  'service.configuration.partnership.anySlotNotCompatible',
                )}
              </Alert>
            )}
          </div>
          <List>
            <Paper>
              {slots.length === 0 ? (
                <div className={props.classes.row}>
                  <WarningIcon
                    className={props.classes.leftIcon}
                    color="error"
                  />
                  <div className={props.classes.columnLeft}>
                    <Typography>
                      {props.t('service.parameters.slots.isEmpty')}
                    </Typography>
                    <Typography color="error">
                      {props.t('service.parameters.slots.explainIsEmpty')}
                    </Typography>
                  </div>
                </div>
              ) : null}
              {slots.map((slot) => {
                if (slot && slot.id) {
                  return (
                    <PrivateSlotListItem
                      key={slot.id}
                      divider
                      availableOnPartnership={
                        privateService.available_on_partnership
                      }
                      onDelete={hasDeletePermission && deletePrivateSlot}
                      onEdit={hasEditPermission && setEditSlotForm}
                      slot={slot}
                    />
                  );
                }
                return <CircularProgress key={slot} />;
              })}
            </Paper>
          </List>
          {hasCreatePermission && (
            <Button
              className={props.classes.button}
              color="primary"
              onClick={() => props.setOpenSlotForm(true)}
              variant="contained"
            >
              <AddIcon className={props.classes.leftIcon} />
              {props.t('service.form.addSlot')}
            </Button>
          )}
          <Dialog open={!!props.editSlotForm}>
            <DialogContent className={props.classes.dialogContent}>
              <PrivateSlotForm
                availableOnPartnership={
                  props.privateService.available_on_partnership
                }
                initial={props.editSlotForm}
                onCancel={() => props.setEditSlotForm(null)}
                onSubmit={(data, options) => {
                  props.updatePrivateSlot(
                    props.privateService.id,
                    {
                      ...data,
                      private_service: props.privateService.id,
                    },
                    props.editSlotForm.id,
                    {
                      onSuccess: () => {
                        props.setEditSlotForm(null);
                        options?.onSuccess();
                      },
                      onError: () => {
                        options?.onError();
                      },
                    },
                  );
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={props.openSlotForm}>
            <DialogContent className={props.classes.dialogContent}>
              <PrivateSlotForm
                availableOnPartnership={
                  props.privateService.available_on_partnership
                }
                onCancel={() => props.setOpenSlotForm(false)}
                onSubmit={(data, options) =>
                  props.createPrivateSlot(
                    props.privateService.id,
                    {
                      ...data,
                      private_service: props.privateService.id,
                    },
                    null,
                    {
                      onSuccess: () => props.setOpenSlotForm(false),
                      onError: () => options.onError && options.onError(),
                    },
                  )
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(5),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  dialogContent: {
    minWidth: '600px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      minWidth: '100%',
      padding: theme.spacing(1),
    },
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAlertContainer: {
    marginBottom: theme.spacing(2),
  },
  alertContainer: {
    marginTop: theme.spacing(1),
  },
  button: { marginTop: theme.spacing(1) },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  columnLeft: {
    display: 'column',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(1),
  },
});
export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('openSlotForm', 'setOpenSlotForm', false),
  withState('editSlotForm', 'setEditSlotForm', null),
)(PrivateSlotEditableList);
