import React from 'react';
import { compose } from 'recompose';

import {
  Typography,
  ButtonBase,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { withStyles } from '@material-ui/styles';
import { WithTranslation, withTranslation } from 'react-i18next';

import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { MaterialStyleType } from '../../../utils/types';
import { RoomBlueprint } from '../../spot-scheduling/types';
import SpotSchedulingHelper from '../../spot-scheduling/utils';

type OwnProps = {
  roomBlueprints: RoomBlueprint[];
  onClickEdit: (roomBlueprint: RoomBlueprint) => void;
  onClickDelete: (roomBlueprint: RoomBlueprint) => void;
  onClickPreview: (roomBlueprint: RoomBlueprint) => void;
  onClickCreate: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

class EstablishmentSpotScheduling extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    return (
      <div>
        <div className={classes.header}>
          <div className={classes.topRow}>
            <Typography variant="h5">
              {t('establishment:spotScheduling.title')}
            </Typography>
          </div>

          <Typography className={classes.subtitle} color="textSecondary">
            {t('establishment:spotScheduling.subtitle')}
          </Typography>
        </div>

        <List disablePadding>
          {this.props.roomBlueprints.map((room) => (
            <ListItem
              divider
              button
              alignItems="center"
              dense
              onClick={() => this.props.onClickPreview(room)}
            >
              <ListItemText
                primary={
                  <Typography component="span" variant="subtitle1">
                    {room.name}
                  </Typography>
                }
                secondary={t('spotScheduling.placeCount', {
                  count: SpotSchedulingHelper.getSpotCount(room),
                })}
              />

              <ListItemResponsiveAction
                actions={[
                  {
                    icon: VisibilityIcon,
                    label: t('common.preview'),
                    onClick: () => this.props.onClickPreview(room),
                  },
                  {
                    icon: EditIcon,
                    label: t('common.edit'),
                    color: 'secondary',
                    onClick: () => this.props.onClickEdit(room),
                  },
                  {
                    icon: DeleteIcon,
                    label: t('common.delete'),
                    onClick: () => this.props.onClickDelete(room),
                  },
                ]}
              />
            </ListItem>
          ))}
        </List>
        <Button
          onClick={this.props.onClickCreate}
          color="primary"
          variant="outlined"
          className={classes.buttonCreateContainer}
        >
          <AddIcon />
          {t('establishment:spotScheduling.add')}
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({
  header: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subtitle: {
    marginTop: theme.spacing(1),
  },
  buttonCreateContainer: {
    margin: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['establishment']),
)(EstablishmentSpotScheduling);
