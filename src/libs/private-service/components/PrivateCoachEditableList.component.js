// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import CoachInput from '../../../components/input/CoachInput.component';

import CoachListItemBasic from '../../associated-coach/components/CoachListItemBasic.component';

import EmptyListWarning from './EmptyListWarning.component';

type Props = {
  privateService: PrivateServiceWithRelatedFields,
  deletePrivateCoach: (
    associated_coach_id: number,
    private_service_id: number,
  ) => void,
  coaches: Array<Coach>,
  createPrivateCoach: (
    associated_coach_id: number,
    private_service_id: number,
    options: any,
  ) => void,

  setAddPrivateCoachOpen: (boolean) => void,
  addPrivateCoachOpen: boolean,
  deleteData: ?[number, number],
  setDeleteData: (?[number, number]) => void,

  t: TFunction,
  classes: Object,
};

const PrivateCoachEditableList = (props: Props) => (
  <div>
    <List>
      {props.privateService.coaches.length === 0 ? (
        <EmptyListWarning
          text={props.t('service.parameters.coaches.isEmpty')}
        />
      ) : null}
      {props.privateService.coaches
        .filter((c) => !!c)
        .map((coach) => (
          <CoachListItemBasic
            coach={coach}
            onDelete={() =>
              props.setDeleteData([
                coach.associated_coach_id,
                props.privateService.id,
              ])
            }
          />
        ))}
    </List>
    <Dialog open={!!props.deleteData}>
      <DialogTitle>{props.t('privateCoach.delete.title')}</DialogTitle>
      <DialogContent>{props.t('privateCoach.delete.explain')}</DialogContent>
      <DialogActions>
        <Button onClick={() => props.setDeleteData(null)}>
          {props.t('privateCoach.delete.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            props.deletePrivateCoach(...props.deleteData);
            props.setDeleteData(null);
          }}
        >
          {props.t('privateCoach.delete.submit')}
        </Button>
      </DialogActions>
    </Dialog>
    {props.addPrivateCoachOpen ? (
      <CoachInput
        value={null}
        onChange={(ev) => {
          props.createPrivateCoach(
            props.coaches.find((c) => c.id === ev.target.value)
              .associated_coach_id,
            props.privateService.id,
            { onSuccess: () => props.setAddPrivateCoachOpen(false) },
          );
        }}
        label={props.t('service.form.coach.label')}
        choices={props.coaches}
      />
    ) : (
      <Button
        variant="outlined"
        onClick={() => props.setAddPrivateCoachOpen(true)}
      >
        <AddIcon className={props.classes.leftIcon} />
        {props.t('service.form.addCoach')}
      </Button>
    )}
  </div>
);

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState('addPrivateCoachOpen', 'setAddPrivateCoachOpen', false),
  withState('deleteData', 'setDeleteData', null),
)(PrivateCoachEditableList);
