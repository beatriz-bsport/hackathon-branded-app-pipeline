import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/styles';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { MaterialStyleType } from '../../../utils/types';
import { RoomBlueprint } from '../types';
import RoomBlueprintsListDialog from '../component/RoomBlueprintsListDialog.component';

type OwnProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onClickSave: () => void;
  onClickExit: () => void;
  blueprints: RoomBlueprint[];
  onChangeBlueprint: (roomBlueprint: RoomBlueprint) => void;
  disableSave: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  showBlueprintList: boolean;
}

class CanvasToolbar extends React.PureComponent<Props, State> {
  state = {
    showBlueprintList: false,
  };

  onClickSave = (ev: any) => {
    ev.preventDefault();
    this.props.onClickSave();
  };

  render() {
    const { classes, t } = this.props;
    return (
      <form onSubmit={this.onClickSave} className={classes.container}>
        <div className={classes.leftContainer}>
          <TextField
            className={classes.marginRight}
            size="small"
            required
            label={t('toolbar.titleLabel')}
            variant="outlined"
            value={this.props.title}
            onChange={(e) => this.props.onTitleChange(e.target.value)}
          />
        </div>
        <div className={classes.rightContainer}>
          <Button
            onClick={() => this.setState({ showBlueprintList: true })}
            variant="outlined"
            className={classes.marginRight}
          >
            {t('toolbar.loadExistingBlueprint')}
          </Button>
          <Button
            className={classes.marginRight}
            variant="contained"
            color="primary"
            type="submit"
          >
            {t('toolbar.save')}
          </Button>

          <Button onClick={this.props.onClickExit}>{t('toolbar.exit')}</Button>
        </div>

        <RoomBlueprintsListDialog
          blueprints={this.props.blueprints}
          open={this.state.showBlueprintList}
          onSubmit={(blueprint) => {
            this.setState({ showBlueprintList: false });
            this.props.onChangeBlueprint(blueprint);
          }}
          onClose={() => this.setState({ showBlueprintList: false })}
        />
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    height: 64,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  leftContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
  rightContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(4),
  },
  marginRight: {
    marginRight: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['spotScheduling']),
  withStyles(styles),
)(CanvasToolbar);
