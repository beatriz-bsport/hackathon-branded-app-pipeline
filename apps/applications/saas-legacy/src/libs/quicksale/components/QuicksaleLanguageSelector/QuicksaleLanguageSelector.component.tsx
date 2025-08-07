import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentLanguageIsoCode from '#src/hooks/useCurrentLanguageIsoCode';
import Config from '#src/config';
import i18n, {
  AVAILABLE_LANGUAGES,
  LANGUAGES,
  switchLanguage,
  // @ts-expect-error JS module without declarations
} from '#src/i18n';

// Map language codes to display codes using LANGUAGES constant
const languageToDisplayCode: Record<string, string> = {
  [LANGUAGES.FRENCH]: 'FR',
  [LANGUAGES.ENGLISH_BRITISH]: 'GB',
  [LANGUAGES.ENGLISH_US]: 'US',
  [LANGUAGES.SPANISH]: 'ES',
  [LANGUAGES.DUTCH]: 'NL',
  [LANGUAGES.GERMAN]: 'DE',
  [LANGUAGES.ITALIAN]: 'IT',
  [LANGUAGES.PORTUGUESE]: 'PT',
  [LANGUAGES.CZECH]: 'CZ',
  [LANGUAGES.DEBUG]: 'ZA',
};

const displayCodeToLanguage = Object.entries(languageToDisplayCode).reduce(
  (acc, [lang, code]) => {
    acc[code] = lang;
    return acc;
  },
  {} as Record<string, string>,
);

const QuicksaleLanguageSelector: React.FC = () => {
  const classes = useStyles();
  const currentLanguage = useCurrentLanguageIsoCode();

  const getAvailableLanguages = () => {
    if (Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
      return AVAILABLE_LANGUAGES;
    }
    return AVAILABLE_LANGUAGES.filter(
      (language: string) => language !== LANGUAGES.DEBUG,
    );
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const displayCode = event.target.value as string;
    const languageCode = displayCodeToLanguage[displayCode];

    if (languageCode) {
      i18n.changeLanguage(languageCode);
      switchLanguage(languageCode);
    }
  };

  const currentDisplayCode = languageToDisplayCode[currentLanguage] || 'GB';

  const availableDisplayCodes = getAvailableLanguages()
    .map((lang: string) => {
      return languageToDisplayCode[lang];
    })
    .filter(Boolean)
    .sort();

  return (
    <FormControl className={classes.wrapper}>
      <Select
        disableUnderline
        displayEmpty
        classes={{ root: classes.select }}
        labelId="quicksale-language-selector"
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            classes: {
              root: classes.popover,
            },
          },
        }}
        name="Language"
        onChange={handleChange}
        value={currentDisplayCode}
      >
        {availableDisplayCodes.map((displayCode: string) => (
          <MenuItem
            key={displayCode}
            className={classes.menuItem}
            value={displayCode}
          >
            {displayCode}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minWidth: 73,
    height: 36,
  },
  select: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 4,
    border: '1px solid rgba(8, 22, 45, 0.5)',
    height: 36,
    padding: 0,
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:focus': {
      borderRadius: 4,
    },
  },
  popover: {
    display: 'flex',
    padding: theme.spacing(1, 0),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: 5,
    backgroundColor: '#FFF',
    boxShadow:
      '0 3px 1px -2px rgba(0, 0, 0, 0.20), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
  },
  menuItem: {
    '&.Mui-selected': {
      backgroundColor: '#209D82',
      color: '#FFF',
      transition: 'background-color 0.2s, color 0.2s',
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#209D82',
    },
  },
}));

export default React.memo(QuicksaleLanguageSelector);
