import React from 'react';

import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core';

import { CustomChip } from '../CustomChip.component';

type Props = {
  isTrue?: boolean;
};

/**
 * A generic custom chip rendering Yes/No with an icon based off a boolean value
 * @prop `isTrue` - If `true`, chip will display Yes label with a success color scheme
 */
const GenericCustomBooleanChip: React.FC<Props> = ({ isTrue }) => {
  const theme = useTheme();
  const { t } = useTranslation('common');

  return isTrue ? (
    <CustomChip
      displayedValue={t('yes')}
      icon="CheckCircle"
      iconColor={theme.palette.success.main}
      mainColor={theme.palette.success.main}
    />
  ) : (
    <CustomChip
      displayedValue={t('no')}
      icon="Cancel"
      iconColor={theme.palette.error.main}
      mainColor={theme.palette.error.main}
    />
  );
};

export default React.memo(GenericCustomBooleanChip);
