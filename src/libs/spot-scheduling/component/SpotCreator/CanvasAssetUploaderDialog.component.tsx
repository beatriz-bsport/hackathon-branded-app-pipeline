import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PanToolIcon from '@material-ui/icons/PanTool';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import LinearProgress from '@material-ui/core/LinearProgress';
import AssetUploaderFormComponent from './AssetUploaderForm.component';
import type { AssetForBlueprint } from '#libs/spot-scheduling/types';
import type { RootState } from '../../../../reducers';
import type { OptionCallback } from '../../../../state/types';
import {
  fetchAssetForBlueprint,
  fetchUnboundedAssetForBlueprintPaginated as fetchUnboundedAssetForBlueprintPaginatedAction,
} from '#libs/spot-scheduling/actions';

import { getAssetUnboudedForBluePrintById } from '#libs/spot-scheduling/selector';

type OwnProps = {
  open: boolean;
  closeDialog: () => void;
  blueprintId: number;
  onClickUnboundedAsset: (toto: any) => void;
  onCreateAsset: (image: File, options?: OptionCallback) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const useAssetStyles = makeStyles({
  root: {
    width: 200,
  },
  media: {
    height: 100,
  },
  forcedWidth: {
    width: 200,
  },
});

const AssetSmallPreview: React.FC<{
  asset: AssetForBlueprint;
  onClickUnboundedAsset: (toto: any) => void;
}> = React.memo(({ asset, onClickUnboundedAsset }) => {
  const classes = useAssetStyles();

  const handleonClickUnboundedAsset = (clickedAsset: AssetForBlueprint) => {
    onClickUnboundedAsset(clickedAsset);
  };
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => handleonClickUnboundedAsset(asset)}>
        <CardMedia className={classes.media} image={asset.asset} />
      </CardActionArea>
    </Card>
  );
});

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      cancel={'[class*="MuiDialogContent-root"]'}
      handle="#draggable-dialog-title"
    >
      <Paper {...props} />
    </Draggable>
  );
}

export const CanvasAssetUploaderDialog: React.FC<Props> = ({
  closeDialog,
  blueprintId,
  fetchUnboundedAssetForBlueprintPaginated,
  assetState,
  open,
  assetLoading,
  onCreateAsset,
  onClickUnboundedAsset,
}) => {
  const { t } = useTranslation('spotScheduling');

  const classes = useStyles();
  const handleClose = (ev: React.MouseEvent, reason: string) => {
    reason !== 'backdropClick' && closeDialog();
  };

  // CDM
  React.useEffect(() => {
    blueprintId &&
      fetchUnboundedAssetForBlueprintPaginated({
        is_unbounded: true,
        blueprint: blueprintId,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assetIds = assetState?.allIds ?? [];
  const assetById = assetState?.byId ?? {};

  const allAssets = assetIds.map((assId: number) => assetById[assId]);
  return (
    <Dialog
      disablePortal
      disableScrollLock
      hideBackdrop
      keepMounted
      aria-labelledby="draggable-dialog-title"
      maxWidth="lg"
      onClose={handleClose}
      open={open}
      PaperComponent={PaperComponent}
    >
      {assetLoading && <LinearProgress />}
      <DialogTitle
        disableTypography
        className={classes.title}
        id="draggable-dialog-title"
        style={{ cursor: 'move' }}
      >
        <Typography variant="h2"> {t('toolsMenu.sections.assets')}</Typography>
        <IconButton onClick={closeDialog}>
          <HighlightOffIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AssetUploaderFormComponent
          loading={assetLoading}
          onCreateAsset={onCreateAsset}
        />

        <div className={classes.assetPreviewsContainer}>
          {(allAssets ?? []).map((asso) => (
            <AssetSmallPreview
              key={asso.identifier}
              asset={asso}
              onClickUnboundedAsset={onClickUnboundedAsset}
            />
          ))}
        </div>
      </DialogContent>

      <Button
        disabled={!assetState?.next_page || assetLoading}
        onClick={() =>
          fetchUnboundedAssetForBlueprintPaginated({
            is_unbounded: true,
            blueprint: blueprintId,
          })
        }
      >
        {t('assetUpoadForm.loadMore')}
      </Button>
      <DialogTitle
        disableTypography
        className={classes.title}
        id="draggable-dialog-title"
        style={{ cursor: 'move' }}
      >
        <div className={classes.footer}>
          <PanToolIcon />
        </div>
      </DialogTitle>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  footer: {
    height: '100px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetPreviewsContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
}));

const connector = connect(
  (state: RootState, props: OwnProps) => ({
    assetLoading: state.spotScheduling.assetUnboundedForBlueprint.loading,
    assetState: getAssetUnboudedForBluePrintById(state, props.blueprintId),
  }),
  {
    fetchAssetForBlueprint,
    fetchUnboundedAssetForBlueprintPaginated:
      fetchUnboundedAssetForBlueprintPaginatedAction,
  },
);
export default React.memo(connector(CanvasAssetUploaderDialog));
