import React from 'react';
import { useTranslation } from 'react-i18next';
import { type Theme, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import BaliseIcon from '@material-ui/icons/SettingsEthernet';

import { getAvailableTagsFromContext } from '#libs/communication-v2/utils';
import { CONTEXT_CADENCE } from '#libs/communication-v2/constants';

import NestedMenu from '#components/NestedMenu.component';

export type Props = {
  tagCategories: { [tag_name: string]: string[] };
  withMaxWidth?: boolean;
  onBaliseItemClick: (item: string) => void;
};

type StylesProps = Pick<Props, 'withMaxWidth'>;

const HTMLTagMenuSelector: React.FC<Props> = ({
  tagCategories,
  withMaxWidth,
  onBaliseItemClick,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles({ withMaxWidth });

  const [menuBalisesAnchorEl, setMenuBalisesAnchorEl] =
    React.useState<HTMLButtonElement>(null);

  const tags = getAvailableTagsFromContext(CONTEXT_CADENCE, tagCategories);

  const handleCloseMenuBalises = React.useCallback(
    () => setMenuBalisesAnchorEl(null),
    [],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const current = event?.currentTarget;
      setMenuBalisesAnchorEl(current);
    },
    [],
  );

  return (
    <div className={classes.container}>
      <Tooltip placement="top" title={t('sendMessage.icons.balise')}>
        <IconButton onClick={handleClick}>
          <BaliseIcon />
        </IconButton>
      </Tooltip>
      <NestedMenu
        forTagsSelector
        anchorElMenu={menuBalisesAnchorEl}
        dataRecord={tags}
        handleCloseMenu={handleCloseMenuBalises}
        onItemClick={onBaliseItemClick}
      />
    </div>
  );
};

const useStyles = makeStyles<Theme, StylesProps>(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: ({ withMaxWidth }) => withMaxWidth && '100%',
  },
}));

export default React.memo(HTMLTagMenuSelector);
