import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import { Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import ToolTip from '#components/Tooltip.component';
// @ts-expect-error
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc.js';
import { UPSELL_IDENTIFIER_SPIVI } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';
import { FeatureList } from '#libs/company/types';
import RoomBlueprintsListDialog from '../component/RoomBlueprintsListDialog.component';
import { RoomBlueprint } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onClickSave: () => void;
  onClickExit: () => void;
  blueprints: RoomBlueprint[];
  onChangeBlueprint: (roomBlueprint: RoomBlueprint) => void;
  disableSave: boolean;
  openSpiviDialog: () => void;
  selectedRoomBlueprint: RoomBlueprint | null;
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
      <form className={classes.container} onSubmit={this.onClickSave}>
        <div className={classes.leftContainer}>
          <TextField
            required
            className={classes.marginRight}
            label={t('toolbar.titleLabel')}
            onChange={(e) => this.props.onTitleChange(e.target.value)}
            size="small"
            value={this.props.title}
            variant="outlined"
          />
        </div>
        <div className={classes.rightContainer}>
          <FeatureListProvider>
            {(featureList: FeatureList) => (
              <>
                {hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI) &&
                  this.props.selectedRoomBlueprint?.spivi_box_id && (
                    <ToolTip title={t('toolbar.spiviHelperText')}>
                      <Button
                        className={classes.marginRight}
                        onClick={this.props.openSpiviDialog}
                        variant="outlined"
                      >
                        {t('toolbar.spivi')}
                      </Button>
                    </ToolTip>
                  )}
              </>
            )}
          </FeatureListProvider>

          <Button
            className={classes.marginRight}
            onClick={() => this.setState({ showBlueprintList: true })}
            variant="outlined"
          >
            {t('toolbar.loadExistingBlueprint')}
          </Button>
          <Button
            className={classes.marginRight}
            color="primary"
            type="submit"
            variant="contained"
          >
            {t('toolbar.save')}
          </Button>

          <Button onClick={this.props.onClickExit}>{t('toolbar.exit')}</Button>
        </div>

        <RoomBlueprintsListDialog
          blueprints={this.props.blueprints}
          onClose={() => this.setState({ showBlueprintList: false })}
          onSubmit={(blueprint) => {
            this.setState({ showBlueprintList: false });
            this.props.onChangeBlueprint(blueprint);
          }}
          open={this.state.showBlueprintList}
        />
      </form>
    );
  }
}

const styles = (theme: Theme) => ({
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
