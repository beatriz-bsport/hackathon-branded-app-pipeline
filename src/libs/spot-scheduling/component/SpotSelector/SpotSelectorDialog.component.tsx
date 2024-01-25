// @ts-nocheck
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import clx from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/styles/withStyles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import WarningIcon from '@material-ui/icons/Warning';
import { Theme } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import { DialogContent, Dialog, Grid } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import { AssetForBlueprint, RoomBlueprint, SpotType } from '../../types';
import { getCoachOrSubstitute } from '../../../offer/utils';
import SpotSelector from './SpotSelector.component';
import { Offer } from '../../../offer/types';
import { MaterialStyleType } from '../../../../utils/types';
import CanvasSpotComponent from '#libs/spot-scheduling/CanvasSvg/tools/Spot/CanvasSpot.component';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';
import {
  formatAsDatetimeAdapted,
  formatAsTime,
} from '../../../../utils/datetime';

interface OwnProps {
  offer?: Offer;
  roomBlueprint?: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  takenSpot: number[];
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onSelectSpot: (index: number, spot?: number) => void;
  selectedSpot?: number;
  forceFullScreen: boolean | null;
  fullScreen: boolean;
  spotTypesOfBlueprint: SpotType[];
  theme: Theme;
  coachDisplay?: MarketPlaceCoachDisplay;
  width: any;
}

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  takenSpotError: boolean;
}

class SpotSelectorDialog extends React.PureComponent<Props, State> {
  state: State = {
    takenSpotError: false,
  };

  getAsset = (identifier: string) => {
    if (this.props.assets) {
      return this.props.assets[identifier];
    }
    return undefined;
  };

  renderRowLegend = (
    spotType?: SpotType,
    getAsset?: (identifier: string) => AssetForBlueprint,
  ) => {
    const { classes, t } = this.props;
    let x = 25;
    let y = 4;
    switch (spotType.shape) {
      case 'rectangle':
        x = 2;
        break;
      case 'triangle':
        x = 17;
        y = 0;
        break;
      default:
        break;
    }

    return (
      <Grid container className={classes.container} direction="row" spacing={3}>
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          xs={4}
        >
          <svg height={73} width={105}>
            <CanvasSpotComponent
              selectingSpot
              asset_identifier="spot_free"
              assets={this.props.assets}
              getAsset={getAsset}
              spotType={spotType}
              x={x}
              y={y}
            />
          </svg>
          <Typography className={classes.spotStatus} variant="body2">
            {spotType?.name
              ? t('spotCreatorForm.freePersonalized', {
                  name: spotType.name,
                })
              : t('spotCreatorForm.free')}
          </Typography>
        </Grid>
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          xs={4}
        >
          <svg height={73} width={105}>
            <CanvasSpotComponent
              selectingSpot
              taken
              asset_identifier="spot_taken"
              assets={this.props.assets}
              getAsset={getAsset}
              spotType={spotType}
              x={x}
              y={y}
            />
          </svg>
          <Typography className={classes.spotStatus} variant="body2">
            {spotType?.name
              ? t('spotCreatorForm.takenPersonalized', {
                  name: spotType.name,
                })
              : t('spotCreatorForm.taken')}
          </Typography>
        </Grid>
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          xs={4}
        >
          <svg height={73} width={105}>
            <CanvasSpotComponent
              selected
              selectingSpot
              asset_identifier="spot_taken"
              assets={this.props.assets}
              getAsset={getAsset}
              spotType={spotType}
              x={x}
              y={y}
            />
          </svg>
          <Typography className={classes.spotStatus} variant="body2">
            {spotType?.name
              ? t('spotCreatorForm.selectedPersonalized', {
                  name: spotType.name,
                })
              : t('spotCreatorForm.selected')}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  renderOtherSpotTypesLegend = () => {
    return (
      <div className={this.props.classes.spotTypesLegendContainer}>
        {this.props.assets && this.renderRowLegend({}, this.getAsset)}
        {this.props?.spotTypesOfBlueprint
          .filter(
            (spotType) =>
              spotType.id !== DEFAULT_SPOT_TYPE_ID || !this.props.assets,
          )
          .map((spotType) => this.renderRowLegend(spotType))}
      </div>
    );
  };

  onSelectSpot = (index: number, spotTypeId: number) => {
    this.setState({ takenSpotError: false });
    this.props.onSelectSpot(index, spotTypeId);
  };

  onSelectTakenSpot = () => {
    this.setState({ takenSpotError: true });
  };

  renderContent = () => {
    const { classes, t, width } = this.props;

    const isMobile = isWidthDown('sm', width);

    if (!this.props.offer) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      );
    }

    return (
      this.props.roomBlueprint && (
        <div
          className={clx({
            [classes.content]: true,
            [classes.contentIsMobile]: isMobile,
          })}
        >
          <SpotSelector
            assets={this.props.assets}
            coach={getCoachOrSubstitute(this.props.offer)}
            coachDisplay={this.props.coachDisplay}
            fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
            isMobile={isMobile}
            onSelectSpot={this.onSelectSpot}
            onSelectTakenSpot={this.onSelectTakenSpot}
            roomBlueprint={this.props.roomBlueprint}
            selectedSpot={this.props.selectedIndex}
            spotTypesOfBlueprint={this.props.spotTypesOfBlueprint}
            takenSpot={this.props.takenSpot}
          />
          <div
            className={clx([
              classes.selectMenu,
              isMobile ? classes.selectMenuIsMobile : null,
            ])}
          >
            {!isMobile && (
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={this.props.onClose}
              >
                <CloseIcon />
              </IconButton>
            )}
            {!isMobile && (
              <div>
                <Typography variant="h5">
                  {t('spotSelectorDialog.title')}
                </Typography>
                <Typography className={classes.metaActivityName} variant="h6">
                  {this.props.offer?.name_override ||
                    this.props.offer?.meta_activity?.name}
                </Typography>
                <div className={classes.dateContainer}>
                  <Typography variant="subtitle1">
                    {`${formatAsDatetimeAdapted(
                      this.props.offer.date_start,
                      'LL',
                      this.props.offer.timezone_name,
                    )}, ${moment(this.props.offer.date_start)
                      .tz(this.props.offer.timezone_name)
                      .format('dddd')}, ${formatAsTime(
                      this.props.offer.date_start,
                      this.props.offer.timezone_name,
                    )}`}
                  </Typography>
                </div>
              </div>
            )}

            <div className={classes.legend}>
              <Typography variant="h6">
                {t('spotSelectorDialog.legend')}
              </Typography>
            </div>
            {this.props?.spotTypesOfBlueprint &&
              this.renderOtherSpotTypesLegend()}
            {!isMobile && (
              <div className={this.props.classes.buttonContainer}>
                <button
                  className={clx([
                    classes.submitButton,
                    this.props.selectedIndex && !this.state.takenSpotError
                      ? classes.submitButtonAvailable
                      : null,
                  ])}
                  disabled={
                    !this.props.selectedIndex || this.state.takenSpotError
                  }
                  onClick={this.props.onSubmit}
                  type="button"
                >
                  <Typography
                    className={classes.submitText}
                    variant="subtitle1"
                  >
                    {typeof this.props.selectedIndex === 'number'
                      ? t('spotSelectorDialog.book', {
                          prefix: this.props.selectedSpot?.prefix,
                          indexType:
                            this.props?.selectedIndexType ||
                            this.props.selectedIndex,
                        })
                      : t('spotSelectorDialog.title')}
                  </Typography>
                </button>
                {this.state.takenSpotError && (
                  <div className={classes.errorContainer}>
                    <WarningIcon color="error" />
                    <Typography className={classes.marginLeft}>
                      {t('spotSelectorDialog.takeSpotError')}
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </div>
          {isMobile && (
            <div
              className={clx([
                this.props.classes.buttonContainer,
                this.props.classes.buttonContainerMobile,
              ])}
            >
              <button
                className={clx([
                  classes.submitButton,
                  classes.submitButtonMobile,
                  this.props.selectedIndex && !this.state.takenSpotError
                    ? classes.submitButtonAvailable
                    : null,
                ])}
                disabled={
                  !this.props.selectedIndex || this.state.takenSpotError
                }
                onClick={this.props.onSubmit}
                type="button"
              >
                <Typography className={classes.submitText} variant="subtitle1">
                  {typeof this.props.selectedIndex === 'number'
                    ? t('spotSelectorDialog.book', {
                        prefix: this.props.selectedSpot?.prefix,
                        indexType:
                          this.props?.selectedIndexType ||
                          this.props.selectedIndex,
                      })
                    : t('spotSelectorDialog.title')}
                </Typography>
              </button>
              {this.state.takenSpotError && (
                <div
                  className={clx(classes.errorContainer, {
                    [classes.errorContainerMobile]: isMobile,
                  })}
                >
                  <WarningIcon color="error" />
                  <Typography className={classes.marginLeft}>
                    {t('spotSelectorDialog.takeSpotError')}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>
      )
    );
  };

  render() {
    const { classes, width, t } = this.props;
    const isMobile = isWidthDown('sm', width);
    return (
      <Dialog
        fullWidth
        classes={{ paper: this.props.classes.dialogPaper }}
        fullScreen={this.props.fullScreen || this.props.forceFullScreen}
        maxWidth="lg"
        open={this.props.open}
        PaperProps={
          !this.props.fullScreen && {
            style: { borderRadius: 20 },
          }
        }
      >
        {isMobile && (
          <div className={classes.mobileTitle}>
            <div className={classes.topMobileTitle}>
              <Typography style={{ width: '100%' }} variant="h5">
                {t('spotSelectorDialog.title')}
              </Typography>
              <IconButton onClick={this.props.onClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <Typography className={classes.metaActivityNameMobile} variant="h6">
              {this.props.offer?.name_override ||
                this.props.offer?.meta_activity?.name}
            </Typography>
            <div className={classes.dateContainer}>
              <Typography variant="subtitle1">
                {`${formatAsDatetimeAdapted(
                  this.props.offer.date_start,
                  'LL',
                  this.props.offer.timezone_name,
                )}, ${moment(this.props.offer.date_start)
                  .tz(this.props.offer.timezone_name)
                  .format('dddd')} ${formatAsTime(
                  this.props.offer.date_start,
                  this.props.offer.timezone_name,
                )}`}
              </Typography>
            </div>
          </div>
        )}
        <DialogContent
          className={clx(this.props.classes.dialogContent, {
            [this.props.classes.dialogContentMobile]: isMobile,
          })}
        >
          {this.renderContent()}
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  dialogPaper: {
    minWidth: '70%',
  },
  container: {
    padding: theme.spacing(3),
  },
  content: {
    display: 'flex',
  },
  contentIsMobile: {
    flexDirection: 'column',
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    height: '100%',
  },
  dialogContent: {
    padding: 0,
    paddingTop: '0 !important',
    height: '80vh',
    paddingBottom: '0 !important',
  },
  dialogContentMobile: {
    backgroundColor: 'rgba(161, 179, 199, 0.15)',
  },
  closeButton: { alignSelf: 'flex-end', marginTop: theme.spacing(2) },
  closeButtonIsMobile: { position: 'absolute', right: '10px' },
  dateContainer: { display: 'flex', color: '#687586' },
  bottomButton: {
    display: 'flex',
    alignItem: 'center',
    flexDirection: 'flex-end',
    paddingBottom: 'calc(2 * env(safe-area-inset-bottom))',
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
  topRowItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    width: '90%',
    alignItems: 'center',
    display: 'flex',
    alignItem: 'center',
  },
  errorContainerMobile: {
    backgroundColor: 'rgba(240, 240, 240)',
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: theme.spacing(2),
    width: '95%',
    padding: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectMenu: {
    width: '40%',
    backgroundColor: 'rgba(161, 179, 199, 0.15)',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2),
    fontWeight: 400,
    display: 'flex',
    flexDirection: 'column',
  },
  selectMenuIsMobile: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: 'transparent',
    width: '100%',
    height: 'auto',
  },
  metaActivityName: {
    marginTop: theme.spacing(4),
    fontWeight: 600,
  },
  metaActivityNameMobile: {
    marginTop: theme.spacing(1),
    fontWeight: 600,
  },
  submitButton: {
    textTransform: 'uppercase',
    marginTop: theme.spacing(5),
    width: '90%',
    backgroundColor: theme.palette.grey[400],
    border: 'none',
    borderRadius: 90,
    marginBottom: theme.spacing(3),
  },
  submitButtonMobile: {
    textTransform: 'uppercase',
    marginTop: theme.spacing(2),
    width: '90%',
    border: 'none',
    borderRadius: 90,
    marginBottom: theme.spacing(1),
    zIndex: 11,
  },
  submitButtonAvailable: {
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
  submitText: { color: 'white' },
  legend: { marginTop: theme.spacing(5), fontWeight: 400 },
  spotStatus: { textAlign: 'center' },
  mobileTitle: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(161, 179, 199, 0.15)',
    alignItems: 'flex-start',
    width: '100%',
  },
  topMobileTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  spotTypesLegendContainer: {
    paddingBottom: '50px',
  },
  buttonContainer: {
    paddingBottom: theme.spacing(1),
    width: '100%%',
    position: 'sticky',
    bottom: '0px',
    zIndex: 10,
  },
  buttonContainerMobile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column-reverse',
  },
});
export default compose<any, OwnProps>(
  withTheme,
  withTranslation(['spotScheduling']),
  // @ts-ignore
  withStyles(styles),
  withMobileDialog({ breakpoint: 'xs' }),
  withWidth(),
)(SpotSelectorDialog);
