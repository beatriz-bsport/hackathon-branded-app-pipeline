import React from 'react';
import omit from 'lodash/omit';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CodeIcon from '@material-ui/icons/Code';
import ReplayIcon from '@material-ui/icons/Replay';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import {
  resetCssWidgetConfiguration as resetCssWidgetConfigurationAction,
  retrieveManagerCssConfiguration as retrieveManagerCssConfigurationAction,
  saveCssConfiguration as saveCssConfigurationAction,
} from '#libs/exportable-components/actions';
import { getCustomCssConfiguration } from '#libs/exportable-components/selectors';

// @ts-expect-error
import withConfirm from '#hocs/with-confirm.hoc';
import CssCodeTextarea from '#libs/exportable-components/components/CssCodeTextarea.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import type { Coach } from '#libs/associated-coach/types';
import CanvasEditorCssPreviewDialog from './CanvasEditorCssPreviewDialog.component';

import type { CanvasElement } from './tools/BaseClasses/Base.tool';
import type { RoomBlueprint, SpotType } from '../types';
import type { RootState } from '../../../reducers';

type Props = {
  roomBluePrint: RoomBlueprint;
  elements: CanvasElement<any>[];
  savedCss: string;
  open: boolean;
  coachHeight: number;
  coach: Coach;
  getAsset: (identifier: string) => string;
  isMobile: boolean;
  spotTypes: SpotType[];
  onClose: () => void;
  coachDisplay?: MarketPlaceCoachDisplay;
} & ConnectedProps<typeof connector>;

/**
 * Generates a dynamic style-sheet for the map based on provided canvas elements.
 *
 * @param {CanvasElement<any>[]} elements - An array of CanvasElement objects with any type of content.
 * @returns {string} The dynamically generated CSS for the map.
 */
const generateBluePrintRawCss = (elements: CanvasElement<any>[]) => {
  // Extracts the IDs of the canvas elements.
  const elementIds = elements?.map((element) => element.id) ?? [];

  // Generates CSS rules for each element ID.
  const cssRules = elementIds.map(
    (_id) => `#svg-canvas-display #${_id} {\n}\n`,
  );

  // The dynamically generated CSS for the map.
  const rawCss = cssRules.join('\n');

  return rawCss;
};

const CanvasEditorCssForm: React.FC<Props> = ({
  savedCss = '',
  roomBluePrint,
  elements,
  saveCssConfiguration,
  cssConfig,
  open,
  coachHeight,
  coach,
  getAsset,
  isMobile,
  spotTypes,
  onClose,
  retrieveManagerCssConfiguration,
  coachDisplay,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['widget', 'spotScheduling']);

  const [code, setCode] = React.useState('');
  const [untouched, setUntouched] = React.useState(true);
  const [openPreview, setOpenPreview] = React.useState(false);

  // CDM
  React.useEffect(() => {
    retrieveManagerCssConfiguration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setCode(
      // The index depends on the roomBluePrint to avoid applying the same style to several maps
      cssConfig?.components_css?.[`roomblueprint_${roomBluePrint.id}`] ??
        generateBluePrintRawCss(elements),
    );
  }, [roomBluePrint, elements, cssConfig]);

  React.useEffect(() => {
    setUntouched(true);
  }, [roomBluePrint?.id]);

  const bsportCSS = generateBluePrintRawCss(elements);

  const hasCustomCss = React.useMemo(() => {
    return bsportCSS !== savedCss;
  }, [bsportCSS, savedCss]);

  const isCssSaved = React.useMemo(() => {
    return code === savedCss;
  }, [code, savedCss]);

  const handleChange = React.useCallback((value: string) => {
    setUntouched(false);
    setCode(value);
  }, []);

  const handleSave = React.useCallback(() => {
    saveCssConfiguration(cssConfig.id, {
      ...cssConfig.components_css,
      [`roomblueprint_${roomBluePrint.id}`]: code,
    });
    setUntouched(true);
  }, [
    roomBluePrint,
    code,
    cssConfig.components_css,
    cssConfig.id,
    saveCssConfiguration,
  ]);

  const handleReset = React.useCallback(() => {
    setCode(generateBluePrintRawCss(elements));
  }, [elements]);

  const customConfigurationPreview = React.useMemo(() => {
    return {
      ...cssConfig,
      components_css: {
        ...omit(cssConfig.components_css, `roomblueprint_${roomBluePrint.id}`),
        [`roomblueprint_${roomBluePrint.id}`]: code,
      },
    };
  }, [cssConfig, code, roomBluePrint?.id]);

  const handleOpenPreview = React.useCallback(() => setOpenPreview(true), []);
  const handleClosePreview = React.useCallback(() => setOpenPreview(false), []);

  const handleCloseForm = React.useCallback(() => {
    onClose();
    setOpenPreview(false);
  }, [onClose]);

  return (
    <GenericResponsiveDialog open={open}>
      <DialogTitle disableTypography className={classes.paperHeader}>
        <div className={classes.paperHeaderTitle}>
          <CodeIcon className={classes.icon} />
          <Typography className={classes.title} variant="h6">
            {t('widget:widget.customCss.CSS')}
          </Typography>
          <ButtonResetComponent onClick={handleReset} />
        </div>
        <div>
          <IconButton onClick={handleCloseForm}>
            <HighlightOffIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className={classes.paper}>
        <div className={classes.innerPaper}>
          <Alert
            action={
              <Button
                color="primary"
                onClick={handleOpenPreview}
                variant="text"
              >
                {t('spotScheduling:cssForm.openPreview')}
              </Button>
            }
            className={classes.alert}
            severity="info"
          >
            {t('spotScheduling:cssForm.helper', {
              buttonLabel: t('spotScheduling:cssForm.openPreview'),
            })}
          </Alert>
          <CssCodeTextarea
            baseCss=""
            code={code}
            onCodeChange={handleChange}
            showBaseCode={false}
          />
        </div>
      </DialogContent>
      <DialogActions className={classes.buttonsContainer}>
        <div>
          {!isCssSaved && !untouched && (
            <Alert className={classes.alert} severity="warning">
              {t('widget:widget.customCss.unsavedChanges')}
            </Alert>
          )}
          {hasCustomCss && isCssSaved && !untouched && (
            <Alert className={classes.alert} severity="success">
              {t('widget:widget.customCss.savedChanges')}
            </Alert>
          )}
        </div>
        <Button
          color="primary"
          onClick={handleSave}
          type="submit"
          variant="contained"
        >
          {t('widget:widget.customCss.save')}
        </Button>
      </DialogActions>
      <CanvasEditorCssPreviewDialog
        coach={coach}
        coachDisplay={coachDisplay}
        coachHeight={coachHeight}
        customConfiguration={customConfigurationPreview}
        elements={elements}
        getAsset={getAsset}
        isMobile={isMobile}
        onClose={handleClosePreview}
        open={openPreview}
        spotTypes={spotTypes}
      />
    </GenericResponsiveDialog>
  );
};

const ButtonResetComponent = withConfirm(
  ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation(['widget']);
    const classes = useStyles();

    return (
      <ButtonBase className={classes.buttonReset} onClick={onClick}>
        <ReplayIcon className={classes.icon} />
        <Typography className={classes.upperCase} color="textSecondary">
          {t('widget:widget.cssEditor.reset')}
        </Typography>
      </ButtonBase>
    );
  },
  'onClick',
  {
    title: 'widget:widget.customCss.dialog.title',
    cancel: 'widget:widget.customCss.dialog.cancel',
    confirm: 'widget:widget.customCss.dialog.confirm',
    Content: (props: { t: TFunction }) => (
      <p>{props.t('widget:widget.customCss.dialog.content')}</p>
    ),
    isDeletion: true,
  },
);

const useStyles = makeStyles((theme) => ({
  paperHeader: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paperHeaderTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  icon: {
    fill: theme.palette.grey[600],
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  buttonReset: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: 5,
  },
  upperCase: {
    textTransform: 'uppercase',
  },
  paper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    height: '100%',
  },
  innerPaper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    height: '100%',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  alert: {
    background: 'none',
    alignItems: 'center',
  },
}));

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  cssConfig: getCustomCssConfiguration(state),
});

const mapDispatchToProps = {
  retrieveManagerCssConfiguration: retrieveManagerCssConfigurationAction,
  resetCssWidgetConfiguration: resetCssWidgetConfigurationAction,
  saveCssConfiguration: saveCssConfigurationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CanvasEditorCssForm);
