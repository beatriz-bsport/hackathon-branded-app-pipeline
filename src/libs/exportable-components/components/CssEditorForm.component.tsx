import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import ReplayIcon from '@material-ui/icons/Replay';
import {
  Button,
  ButtonBase,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Switch from '@material-ui/core/Switch';
// @ts-ignore
import withConfirm from '#hocs/with-confirm.hoc';
import CssCodeTextarea from './CssCodeTextarea.component';
import { getCssComponentByLabel } from '../utils';
import { cleanCSSFile } from '#libs/widget/utils';

type Props = {
  code: string;
  savedCss: string;
  componentId: string;
  onCodeChange: (value: string) => void;
  onSave: (value: string) => void;
};

const CssEditorForm: React.FC<Props> = ({
  code,
  savedCss,
  componentId,
  onCodeChange,
  onSave,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('widget');

  const [untouched, setUntouched] = useState(true);
  const [showBaseCode, setShowBaseCode] = useState(false);

  useEffect(() => {
    setUntouched(true);
  }, [componentId]);

  const bsportCSS = cleanCSSFile(getCssComponentByLabel(componentId).css);
  const hasCustomCss = bsportCSS !== savedCss;
  const isCssSaved = code === savedCss;

  const handleChange = useCallback(
    (value: string) => {
      setUntouched(false);
      onCodeChange(value);
    },
    [onCodeChange],
  );

  const handleSave = useCallback(() => {
    onSave(code);
  }, [code, onSave]);

  const handleReset = useCallback(() => {
    onCodeChange(bsportCSS);
  }, [bsportCSS, onCodeChange]);

  const handleShowCode = useCallback((_, checked: boolean) => {
    setShowBaseCode(checked);
  }, []);

  return (
    <Paper className={classes.paper}>
      <div className={classes.innerPaper}>
        <Typography variant="h6" className={classes.title}>
          <CodeIcon className={classes.icon} />
          {t('widget.customCss.CSS')}
        </Typography>
        <FormControlLabel
          control={<Switch checked={showBaseCode} onChange={handleShowCode} />}
          label={t('widget.customCss.showBsportCode')}
          labelPlacement="start"
        />
        <CssCodeTextarea
          code={code}
          baseCss={getCssComponentByLabel(componentId).css}
          onCodeChange={handleChange}
          showBaseCode={showBaseCode}
        />
        <div className={classes.buttonsContainer}>
          <div>
            {!isCssSaved && !untouched && (
              <Alert className={classes.alert} severity="warning">
                {t('widget.customCss.unsavedChanges')}
              </Alert>
            )}
            {hasCustomCss && isCssSaved && !untouched && (
              <Alert className={classes.alert} severity="success">
                {t('widget.customCss.savedChanges')}
              </Alert>
            )}
          </div>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            onClick={handleSave}
          >
            {t('widget.customCss.save')}
          </Button>
        </div>
      </div>
      <ButtonResetComponent onClick={handleReset} />
    </Paper>
  );
};

const ButtonResetComponent = withConfirm(
  ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation(['widget']);
    const classes = useStyles();

    return (
      <ButtonBase className={classes.buttonReset} onClick={onClick}>
        <ReplayIcon className={classes.icon} />
        <Typography color="textSecondary" className={classes.upperCase}>
          {t('widget.cssEditor.reset')}
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
  icon: {
    fill: theme.palette.grey[600],
  },
  title: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  buttonReset: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
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
  },
}));

export default CssEditorForm;
