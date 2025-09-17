// @flow
import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import useCurrentLanguageIsoCode from '../../hooks/useCurrentLanguageIsoCode';

import i18n, {
  AVAILABLE_LANGUAGES,
  LANGUAGES,
  switchLanguage,
} from '../../i18n';

import FR_FLAG from '../input/flags/FR.png';
import ES_FLAG from '../input/flags/ES.png';
import NL_FLAG from '../input/flags/NL.png';
import IT_FLAG from '../input/flags/IT.png';
import DE_FLAG from '../input/flags/DE.png';
import EN_FLAG from '../input/flags/EN.png';
import US_FLAG from '../input/flags/US.png';
import PT_FLAG from '../input/flags/PT.png';
import ZA_FLAG from '../input/flags/ZA.png';
import Config from '../../config';

type Props = {
  closeMenu: () => void,
  classes: Object,
  t: TFunction,
  handleChange: (any) => void,
  value: string,
  allowNull?: boolean,
  noLabel?: boolean,
};

type UserLanguagePickerProps = {
  /** Extra action fired after the user selected a language option (language changed) */
  onLocaleChange?: () => void,
};

const countryFlag = {
  [LANGUAGES.FRENCH]: FR_FLAG,
  [LANGUAGES.GERMAN]: DE_FLAG,
  [LANGUAGES.ENGLISH_BRITISH]: EN_FLAG,
  [LANGUAGES.ENGLISH_US]: US_FLAG,
  [LANGUAGES.DUTCH]: NL_FLAG,
  [LANGUAGES.ITALIAN]: IT_FLAG,
  [LANGUAGES.SPANISH]: ES_FLAG,
  [LANGUAGES.PORTUGUESE]: PT_FLAG,
  [LANGUAGES.DEBUG]: ZA_FLAG,
};

const LanguageSelectBase = (props: Props) => {
  const { classes, value, handleChange, closeMenu, allowNull, noLabel, t } =
    props;

  const renderMenuItem = (lng, noLabelMenuItem?: boolean) => {
    return (
      <MenuItem key={lng} component="div" value={lng}>
        {lng !== 'none' && (
          <img alt="text" className={classes.flag} src={countryFlag[lng]} />
        )}
        {!noLabelMenuItem && t(`language.${lng}`)}
      </MenuItem>
    );
  };

  const getAvailableLanguages = () => {
    if (Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
      return AVAILABLE_LANGUAGES;
    }
    return AVAILABLE_LANGUAGES.filter(
      (language) => language !== LANGUAGES.DEBUG,
    );
  };

  return (
    <FormControl>
      <Select
        labelId="langage-selector"
        name="Language"
        onChange={(e) => {
          handleChange(e);
          if (closeMenu) {
            return closeMenu();
          }
          return null;
        }}
        renderValue={(valueRendered) => renderMenuItem(valueRendered, noLabel)}
        value={value}
      >
        <MenuItem disabled component="div" value="">
          {t('navigation.pick_a_language')}
        </MenuItem>
        {getAvailableLanguages().map((lng) => renderMenuItem(lng))}
        {!!allowNull && (
          <MenuItem component="div" value="none">
            {t('navigation.automaticLanguage')}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

const styles = (theme) => ({
  flag: {
    width: (297 / 210) * 15,
    height: 15,
    marginRight: theme.spacing(1),
  },
});

export const LanguageSelect = withStyles(styles)(
  withTranslation(['consumerSpace'])(LanguageSelectBase),
);

const UserLanguagePicker = (props: UserLanguagePickerProps) => {
  const language = useCurrentLanguageIsoCode();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
    switchLanguage(event.target.value);
    props.onLocaleChange?.();
  };

  return (
    <LanguageSelect handleChange={handleChange} value={language} {...props} />
  );
};
export default UserLanguagePicker;
