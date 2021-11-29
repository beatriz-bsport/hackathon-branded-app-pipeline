// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import chroma from 'chroma-js';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import { getTextColorFromRGB } from '../../../utils/color';
import Tooltip from '../../../components/Tooltip.component';
import ColorInput from '../../../components/input/ColorInput.component';
import CoachListItem from './CoachListItem.component';

const extractInitialLetters = (associatedCoach: AssociatedCoach) => {
  if (associatedCoach.firstname && associatedCoach.lastname) {
    return associatedCoach.firstname[0] + associatedCoach.lastname[0];
  }
  if (associatedCoach.first_name) {
    return associatedCoach.firstname[0];
  }
  return 'X';
};

const CoachColorSquare = (props: {
  classes: Object,
  associatedCoach: AssociatedCoach,
  onClick: () => void,
}) => {
  const backgroundColor = props.associatedCoach.color || '#DCF2D7';
  const textColor = getTextColorFromRGB(chroma(backgroundColor).rgb());
  return (
    <Tooltip title={props.associatedCoach.name}>
      <IconButton
        onClick={props.onClick}
        classes={{ root: props.classes.avatarButton }}
      >
        <Avatar
          className={props.classes.avatar}
          style={{ backgroundColor, color: textColor }}
        >
          {extractInitialLetters(props.associatedCoach).toUpperCase()}
        </Avatar>
      </IconButton>
    </Tooltip>
  );
};

const ColorModifierForm = withState(
  'newColor',
  'setColor',
  null,
)(
  (props: {
    t: TFunction,
    open: boolean,
    associatedCoach: ?AssociatedCoach,
    onSubmit: (data: { id: number, color: string }) => void,
    onCancel: () => void,
  }) => {
    if (!props.associatedCoach) {
      return <CircularProgress />;
    }
    return (
      <React.Fragment>
        <DialogTitle>{props.t('color.form.title')}</DialogTitle>
        <DialogContent>
          <CoachListItem coach={props.associatedCoach} />
          <ColorInput
            transparentColorAvailable
            color={props.newColor || props.associatedCoach.color}
            onChange={props.setColor}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {props.t('color.form.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              const formData = new FormData();
              formData.append(
                'color',
                props.newColor || props.associatedCoach.color,
              );
              formData.append('id', props.associatedCoach.id);
              props.onSubmit(formData);
            }}
          >
            {props.t('color.form.submit')}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  },
);

type Props = {
  classes: Object,
  associatedCoachList: Array<AssociatedCoach>,
  selectedAssociatedCoach: AssociatedCoach,
  setSelectedAssociatedCoach: (coach: ?AssociatedCoach) => void,
  updateCoach: (data: any) => void,
  t: TFunction,
};

export const CoachColorModifer = (props: Props) => {
  return (
    <div className={props.classes.row}>
      {props.associatedCoachList.map((associatedCoach) => (
        <div className={props.classes.avatarContainer} key={associatedCoach.id}>
          <CoachColorSquare
            associatedCoach={associatedCoach}
            classes={props.classes}
            onClick={() => props.setSelectedAssociatedCoach(associatedCoach)}
          />
        </div>
      ))}
      <Dialog open={!!props.selectedAssociatedCoach}>
        <ColorModifierForm
          t={props.t}
          associatedCoach={props.selectedAssociatedCoach}
          onCancel={() => props.setSelectedAssociatedCoach(null)}
          onSubmit={(data) => {
            props.updateCoach(data);
            props.setSelectedAssociatedCoach(null);
          }}
        />
      </Dialog>
    </div>
  );
};

const styles = (theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflowY: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  avatarContainer: {
    marginLeft: theme.spacing(1),
  },
  avatarButton: {
    display: 'inline-block',
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },
  avatar: {
    width: 30,
    height: 30,
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('selectedAssociatedCoach', 'setSelectedAssociatedCoach', null),
)(CoachColorModifer);
