import React from 'react';

import { createTheme, makeStyles, MuiThemeProvider } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';

import type { SelectOption } from '#src/libs/types';
import type { CadenceFinerGrainEventsSearchObjectTypes } from '#src/libs/sequential_marketing/types';

import { DEFAULT_REACT_SELECT_MAX_HEIGHT } from './constants';

import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';

const searchbarResultCustomTheme = createTheme({
  overrides: {
    MuiChip: {
      root: {
        borderRadius: '2px',
        backgroundColor: '#E9EBEE',
        color: 'rgba(0, 0, 0, 0.87)',
        margin: '2px',
      },
      label: {
        color: 'rgba(0, 0, 0, 0.87)',
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },
    },
    MuiButton: {
      label: {
        color: 'rgba(0, 0, 0, 0.87)',
      },
    },
    MuiSvgIcon: {
      root: {
        color: 'rgba(0, 0, 0, 0.87)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  },
});

type FinerGrainSpecificItemSelectorProps = {
  open: boolean;
  searchedObjectType: CadenceFinerGrainEventsSearchObjectTypes;
  handleSpecificItemChange: (event: SelectOption<number>[]) => void;
  defaultItemsIds: number[];
};

const FinerGrainSpecificItemSelector: React.FC<
  FinerGrainSpecificItemSelectorProps
> = ({
  defaultItemsIds,
  open,
  searchedObjectType,
  handleSpecificItemChange,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('marketing');
  const objectSearchAdditionalParams = React.useMemo(
    () =>
      searchedObjectType === 'private_pass'
        ? { available: true }
        : { disabled: false },
    [searchedObjectType],
  );

  return (
    <div className={styles.specificItemDiv}>
      <Divider className={styles.divider} orientation="vertical" />
      {open && searchedObjectType && (
        <div className={styles.specificItemSearchBarContainer}>
          <Typography variant="body2">
            {t('cadence.form.trigger.finerGrain.purchaseLabelTitle')}
          </Typography>
          <MuiThemeProvider theme={searchbarResultCustomTheme}>
            <ObjectSearchComponent
              isMulti
              additionalParams={{
                page_size: 10,
                ...objectSearchAdditionalParams,
              }}
              className={styles.specificItemSearchBar}
              initialValues={defaultItemsIds}
              isMenuOpen={open}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              menuPosition="absolute"
              minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
              onChange={handleSpecificItemChange}
              placeholder={t('customForm.field.select_placeholder')}
              searchedObjectType={searchedObjectType}
              variant="mui-selector"
            />
          </MuiThemeProvider>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  specificItemDiv: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    height: 'auto',
  },
  divider: {
    height: 'auto',
  },
  specificItemSearchBarContainer: {
    width: '100%',
    gap: '16px',
  },
  specificItemSearchBar: {
    scrollbarWidth: 'none',
  },
}));

export default React.memo(FinerGrainSpecificItemSelector);
