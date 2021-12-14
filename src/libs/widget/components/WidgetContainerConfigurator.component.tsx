import React from 'react';

import { compose } from 'recompose';

import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';

import moment from 'moment-timezone';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import {
  DIALOG_MODE_POPUP,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_TAB,
} from '@bsport/common/lib/master-data/widget-dialog-mode';

import { MaterialStyleType } from '../../../utils/types';
import { LanguageSelect } from '../../../components/button/LanguageButton.component';

type OwnProps = {
  showFab: boolean;
  useIframe: boolean;
  onChangeContainerConfiguration: (args: any) => void;
  dialogMode: number;
  language: string | null;
  fullScreenPopup: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const WidgetContainerConfigurator = (props: Props) => {
  const { classes, t } = props;
  const onChangeCompatibilityMode = (e: any, checked: boolean) => {
    props.onChangeContainerConfiguration({
      useIframe: checked,
      dialogMode: checked ? DIALOG_MODE_TAB : DIALOG_MODE_IFRAME,
    });
  };

  const onChangeShowFab = (e: any, checked: boolean) => {
    props.onChangeContainerConfiguration({
      showFab: checked,
    });
  };
  const onChangeLanguage = (e: any) => {
    props.onChangeContainerConfiguration({
      language: e.target.value,
    });
  };
  const onChangeDialogMode = (dialogMode: number) => {
    props.onChangeContainerConfiguration({ dialogMode });
  };

  const onChangeDialogSize = (e: any) => {
    props.onChangeContainerConfiguration({
      fullScreenPopup: e.target.value === 'true',
    });
  };

  return (
    <fieldset>
      <legend>{t('widget.containerConfiguration.title')}</legend>
      <div className={classes.container}>
        <FormControlLabel
          control={
            <Checkbox
              checked={props.useIframe}
              onChange={onChangeCompatibilityMode}
              name="checkedA"
            />
          }
          label={t('widget.ownStyle')}
        />

        <div className={classes.showFabContainer}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.showFab}
                onChange={onChangeShowFab}
                name="checkedB"
              />
            }
            label={t('widget.showFabLabel')}
          />

          <a
            target="_blank"
            rel="noreferrer"
            href={`https://intercom.help/bsport-helpcenter/${moment
              .locale()
              .slice(0, 2)}/articles/4942264`}
            className={classes.link}
          >
            <HelpOutlineIcon />
          </a>
        </div>

        <FormControl className={classes.dialogMode}>
          <InputLabel>{t('widget.dialogModeLabel')}</InputLabel>
          <Select
            className={classes.fullWidth}
            value={props.dialogMode}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              onChangeDialogMode(parseInt(ev.target.value, 10))
            }
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
          </Select>
        </FormControl>

        {props.dialogMode !== DIALOG_MODE_TAB && (
          <FormControl className={classes.dialogMode}>
            <InputLabel>{t('widget.dialogSizeLabel')}</InputLabel>
            <Select
              className={classes.fullWidth}
              value={props.fullScreenPopup.toString()}
              onChange={onChangeDialogSize}
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
              handleChange={onChangeLanguage}
              value={props.language}
              allowNull
              label={t('widget.pickALanguage')}
              none={t('widget.browserLanguage')}
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
});

export default compose<any, Props>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['widget']),
)(WidgetContainerConfigurator);
