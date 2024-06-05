import React from 'react';
import { withStyles } from '@material-ui/styles';
import { compose } from 'recompose';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core';
import { TFunction } from 'i18next';
// @ts-expect-error
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc.js';
import { UPSELL_IDENTIFIER_SPIVI } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';
import { FeatureList } from '#libs/company/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import SpiviCorrespondenceTable from '../SpiviCorrespondenceTable.component';
import { MaterialStyleType } from '../../../../utils/types';
import { AssetForBlueprint, RoomBlueprint, SpotType } from '../../types';
import CanvasPreview from './CanvasPreview.component';

interface OwnProps {
  roomBlueprint?: RoomBlueprint;
  assets: { [identifier: string]: AssetForBlueprint };
  open: boolean;
  onClose: () => void;
  takenSpot?: number[];
  selectedSpot?: number;
  spotCorrespondence: Array<Array<string>>;
  spotTypes: Array<SpotType>;
  tablePages: { [identifier: string]: number };
  tableCountPages: { [identifier: string]: number };
  handlePageChange: (
    ev: React.ChangeEvent<unknown>,
    value: number,
    spotTypeId: number,
  ) => void;
  t: TFunction;
  fetchSpotForBlueprint: () => void;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class CanvasPreviewDialog extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    return (
      <GenericResponsiveDialog maxWidth="md" open={this.props.open}>
        <FeatureListProvider>
          {(featureList: FeatureList) => {
            const showSpiviCorrespondence =
              hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI) &&
              this.props.roomBlueprint?.spivi_box_id;

            return (
              <div className={classes.row}>
                <div className={classes.column}>
                  <MuiDialogTitle
                    disableTypography
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">
                      {this.props.roomBlueprint?.name}
                    </Typography>
                    {!showSpiviCorrespondence && (
                      <IconButton
                        aria-label="close"
                        onClick={this.props.onClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </MuiDialogTitle>
                  <DialogContent style={{ height: 800 }}>
                    <CanvasPreview
                      assets={this.props.assets}
                      fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
                      roomBlueprint={this.props.roomBlueprint}
                      selectedSpot={this.props.selectedSpot}
                      spotTypes={this.props.spotTypes}
                      takenSpot={this.props.takenSpot}
                    />
                  </DialogContent>
                </div>
                {showSpiviCorrespondence && (
                  <div className={classes.grey}>
                    <MuiDialogTitle
                      disableTypography
                      className={classes.spiviCorrespondenceTitle}
                    >
                      <Typography variant="h6">
                        {t('spotScheduling:spiviDialog.spotCorrespondence')}
                      </Typography>
                      <IconButton
                        aria-label="close"
                        onClick={this.props.onClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </MuiDialogTitle>
                    <DialogContent className={classes.spiviCorrespondenceTable}>
                      {this.props.spotTypes.map(
                        (spotType: SpotType, index: number) => {
                          if (
                            this.props.spotCorrespondence &&
                            this.props.spotTypes &&
                            this.props.tablePages &&
                            this.props.tableCountPages
                          )
                            return (
                              <SpiviCorrespondenceTable
                                key={`${spotType.id}-${index}`}
                                handlePageChange={this.props.handlePageChange}
                                pageCount={
                                  this.props.tableCountPages[spotType.id]
                                }
                                pageNumber={this.props.tablePages[spotType.id]}
                                spotCorrespondence={
                                  this.props.spotCorrespondence[spotType.id]
                                }
                                spotType={spotType}
                                spotTypeId={spotType.id}
                              />
                            );
                          return <div />;
                        },
                      )}
                    </DialogContent>
                  </div>
                )}
              </div>
            );
          }}
        </FeatureListProvider>
      </GenericResponsiveDialog>
    );
  }
}

const styles = (theme: Theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  grey: {
    backgroundColor: theme.palette.grey[100],
  },
  spiviCorrespondenceTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spiviCorrespondenceTable: { height: 800 },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasPreviewDialog);
