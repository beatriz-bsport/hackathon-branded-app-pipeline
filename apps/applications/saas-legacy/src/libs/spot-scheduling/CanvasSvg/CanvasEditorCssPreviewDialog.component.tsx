import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/styles/makeStyles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ApplyCustomCssStyles from '#src/libs/widget/components/ApplyCustomCssStyles.component';
import type { Coach } from '#src/libs/associated-coach/types';
import type { MarketplaceCSSConfiguration } from '#src/libs/exportable-components/types';
import { CanvasElement } from './tools/BaseClasses/Base.tool';
import type { SpotType } from '../types';
import CanvasViewController from './CanvasViewController';

const WrappedCanvasViewController =
  marketplaceCssHoc<React.ComponentProps<typeof CanvasViewController>>()(
    CanvasViewController,
  );

type Props = {
  open: boolean;
  onClose: () => void;
  coachHeight: number;
  coach: Coach;
  elements: CanvasElement<any>[];
  getAsset: (identifier: string) => string;
  isMobile: boolean;
  spotTypes: SpotType[];
  customConfiguration: MarketplaceCSSConfiguration;
  coachDisplay?: MarketPlaceCoachDisplay;
};

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      cancel={'[class*="MuiDialogContent-root"]'}
      handle="#draggable-dialog-canvas-css-editor"
    >
      <Paper {...props} style={{ width: '600px' }} />
    </Draggable>
  );
}
export const CanvasEditorCssPreviewDialog: React.FC<Props> = ({
  open,
  onClose,
  coachHeight,
  coach,
  elements,
  getAsset,
  isMobile,
  spotTypes,
  customConfiguration,
  coachDisplay,
}) => {
  const dialogContentRef = React.createRef<HTMLDivElement>();
  const { t } = useTranslation('spotScheduling');
  const classes = useStyles();

  return (
    <Dialog
      disablePortal
      disableScrollLock
      hideBackdrop
      keepMounted
      aria-labelledby="draggable-dialog-canvas-css-editor"
      maxWidth="lg"
      open={open}
      PaperComponent={PaperComponent}
    >
      <DialogTitle
        disableTypography
        className={classes.previewDialogTitle}
        id="draggable-dialog-canvas-css-editor"
        style={{ cursor: 'move' }}
      >
        <Typography variant="h2">{t('toolsMenu.sections.assets')}</Typography>
        <IconButton onClick={onClose}>
          <HighlightOffIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent ref={dialogContentRef}>
        <WrappedCanvasViewController
          disabledEdit
          isBoutiqueDisplay
          coach={coach}
          coachDisplay={coachDisplay}
          coachHeight={coachHeight}
          containerRef={dialogContentRef}
          elements={elements}
          getAsset={getAsset}
          isMobile={isMobile}
          showGrid={false}
          spotTypes={spotTypes}
        />
        <ApplyCustomCssStyles customConfiguration={customConfiguration} />
      </DialogContent>
    </Dialog>
  );
};
const useStyles = makeStyles(() => ({
  previewDialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
}));

export default memo(CanvasEditorCssPreviewDialog);
