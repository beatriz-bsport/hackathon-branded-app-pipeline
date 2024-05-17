// @ts-nocheck
import React from 'react';

import { compose } from 'recompose';

import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import {
  DIALOG_MODE_POPUP,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_TAB,
  DIALOG_MODE_DEACTIVATED,
} from '@bsport/common/lib/master-data/widget-dialog-mode';

import { MaterialStyleType } from '../../../utils/types';
import { LanguageSelect } from '../../../components/button/LanguageButton.component';
import { getIntercomLink } from '../utils';

type OwnProps = {
  showFab: boolean;
  useIframe: boolean;
  responsiveIframe: boolean;
  onChangeContainerConfiguration: (args: any) => void;
  dialogMode: number;
  language: string | null;
  fullScreenPopup: boolean;
  isFranchisor?: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const WidgetContainerConfigurator = (props: Props) => {
  const { classes, t } = props;
  const onChangeCompatibilityMode = (e: any, checked: boolean) =>
    props.onChangeContainerConfiguration({
      useIframe: checked,
      dialogMode: checked ? DIALOG_MODE_TAB : DIALOG_MODE_IFRAME,
    });

  const onChangeIframeResponsiveMode = (e: any, checked: boolean) =>
    props.onChangeContainerConfiguration({
      useIframe: true,
      responsiveIframe: checked,
    });
  const onChangeShowFab = (e: any, checked: boolean) =>
    props.onChangeContainerConfiguration({
      showFab: checked,
    });

  const onChangeLanguage = (e: any) =>
    props.onChangeContainerConfiguration({
      language: e.target.value,
    });

  const onChangeDialogMode = (dialogMode: number) =>
    props.onChangeContainerConfiguration({ dialogMode });

  const onChangeDialogSize = (e: any) =>
    props.onChangeContainerConfiguration({
      fullScreenPopup: e.target.value === 'true',
    });

  return (
    <fieldset>
      <legend>{t('widget.containerConfiguration.title')}</legend>
      <div className={classes.container}>
        <FormControlLabel
          control={
            <Checkbox
              checked={props.useIframe}
              name="checkedA"
              onChange={onChangeCompatibilityMode}
            />
          }
          label={t('widget.ownStyle')}
        />

        <Collapse in={props.useIframe}>
          <div className={classes.iframeSettings}>
            <FormControlLabel
              control={
                <Switch
                  checked={props.responsiveIframe}
                  name="checkedResponsiveIframe"
                  onChange={onChangeIframeResponsiveMode}
                />
              }
              label={t('widget.responsiveIframe')}
            />
          </div>
        </Collapse>
        {!props.isFranchisor && (
          <div className={classes.showFabContainer}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showFab}
                  name="checkedB"
                  onChange={onChangeShowFab}
                />
              }
              label={t('widget.showFabLabel')}
            />

            <a
              className={classes.link}
              href={getIntercomLink()}
              rel="noreferrer"
              target="_blank"
            >
              <HelpOutlineIcon />
            </a>
          </div>
        )}

        <FormControl className={classes.dialogMode}>
          <InputLabel>{t('widget.dialogModeLabel')}</InputLabel>
          <Select
            className={classes.fullWidth}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              onChangeDialogMode(parseInt(ev.target.value, 10))
            }
            value={props.dialogMode}
          >
            <MenuItem value={DIALOG_MODE_TAB}>
              {t(`widget.dialogMode.tab`)}
            </MenuItem>
            {!props.useIframe && (
              <MenuItem value={DIALOG_MODE_IFRAME}>
                {t(`widget.dialogMode.iframe`)}
              </MenuItem>
            )}
            <MenuItem value={DIALOG_MODE_POPUP}>
              {t(`widget.dialogMode.popup`)}
            </MenuItem>
            <MenuItem
              className={classes.flexItem}
              value={DIALOG_MODE_DEACTIVATED}
            >
              {t(`widget.dialogMode.stayInContainer`)}
              <Typography color="primary" variant="caption">
                {t(`widget.dialogMode.stayInContainerBetaTag`)}
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>

        {![DIALOG_MODE_TAB, DIALOG_MODE_DEACTIVATED].includes(
          props.dialogMode,
        ) && (
          <FormControl className={classes.dialogMode}>
            <InputLabel>{t('widget.dialogSizeLabel')}</InputLabel>
            <Select
              className={classes.fullWidth}
              onChange={onChangeDialogSize}
              value={props.fullScreenPopup.toString()}
            >
              <MenuItem value="false">{t(`widget.dialogSize.window`)}</MenuItem>

              {!props.useIframe && (
                <MenuItem value="true">
                  {t(`widget.dialogSize.fullScreen`)}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        )}

        <div className={classes.language}>
          <div className={classes.languageSelect}>
            <LanguageSelect
              allowNull
              handleChange={onChangeLanguage}
              label={t('widget.pickALanguage')}
              none={t('widget.browserLanguage')}
              value={props.language}
            />
          </div>
          <Tooltip title={t('widget.languageHelper')}>
            <HelpOutlineIcon />
          </Tooltip>
        </div>
      </div>
    </fieldset>
  );
};

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  showFabContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
      color: 'black',
    },
  },
  dialogMode: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  language: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    marginTop: theme.spacing(2),
  },
  languageSelect: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  iframeSettings: {
    paddingLeft: theme.spacing(2),
  },
  flexItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['widget']),
)(WidgetContainerConfigurator);
