import React from 'react';

import chroma from 'chroma-js';

import { useTranslation } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createTheme';

import { getTextColorFromRGB } from '../../../utils/color';
import Tooltip from '#components/Tooltip.component';
import ColorInput from '#components/input/ColorInput.component';
import CoachListItem from './CoachListItem.component';
import type { Coach } from '../types';

import type { OptionCallback } from '../../../state/types';

const extractInitialLetters = (associatedCoach: Coach) => {
  if (associatedCoach.firstname && associatedCoach.lastname) {
    return associatedCoach.firstname[0] + associatedCoach.lastname[0];
  }
  if (associatedCoach.firstname) {
    return associatedCoach.firstname[0];
  }
  return 'X';
};

const CoachColorSquare = (props: {
  associatedCoach: Coach;
  onClick: () => void;
}) => {
  const classes = useStyles();

  const backgroundColor = props.associatedCoach.color || '#DCF2D7';
  const textColor = getTextColorFromRGB(chroma(backgroundColor).rgb());

  return (
    <Tooltip title={props.associatedCoach.name}>
      <IconButton
        onClick={props.onClick}
        classes={{ root: classes.avatarButton }}
      >
        <Avatar
          className={classes.avatar}
          style={{ backgroundColor, color: textColor }}
        >
          {extractInitialLetters(props.associatedCoach).toUpperCase()}
        </Avatar>
      </IconButton>
    </Tooltip>
  );
};

const ColorModifierForm = (props: {
  associatedCoach?: Coach;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation('privateService');

  const [newColor, setColor] = React.useState<string>(null);

  if (!props.associatedCoach) {
    return <CircularProgress />;
  }

  return (
    <React.Fragment>
      <DialogTitle>{t('color.form.title')}</DialogTitle>
      <DialogContent>
        <CoachListItem coach={props.associatedCoach} />
        <ColorInput
          transparentColorAvailable
          color={newColor || props.associatedCoach?.color}
          onChange={setColor}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>{t('color.form.cancel')}</Button>
        <Button
          color="primary"
          onClick={() => {
            const formData = new FormData();
            formData.append('color', newColor || props.associatedCoach?.color);
            formData.append('id', props.associatedCoach?.id.toString());
            props.onSubmit(formData);
          }}
        >
          {t('color.form.submit')}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

type Props = {
  associatedCoachList: Array<Coach>;
  updateCoach: (data: any, options?: OptionCallback) => void;
};

export const CoachColorModifier: React.FC<Props> = ({
  associatedCoachList,
  updateCoach,
}) => {
  const classes = useStyles();

  const [selectedAssociatedCoach, setSelectedAssociatedCoach] =
    React.useState<Coach>(null);

  return (
    <div className={classes.row}>
      {associatedCoachList.map((associatedCoach) => (
        <div className={classes.avatarContainer} key={associatedCoach?.id}>
          <CoachColorSquare
            associatedCoach={associatedCoach}
            onClick={() => setSelectedAssociatedCoach(associatedCoach)}
          />
        </div>
      ))}
      <Dialog open={!!selectedAssociatedCoach}>
        <ColorModifierForm
          associatedCoach={selectedAssociatedCoach}
          onCancel={() => setSelectedAssociatedCoach(null)}
          onSubmit={(data) => {
            updateCoach(data);
            setSelectedAssociatedCoach(null);
          }}
        />
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

export default CoachColorModifier;
