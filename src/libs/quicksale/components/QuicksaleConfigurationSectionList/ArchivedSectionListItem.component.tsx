import React from 'react';
import { TFunction } from 'i18next';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import MuiIcon from '#components/MuiIcon.component';
import { QuicksaleSection } from '../../types';

type Props = {
  section: QuicksaleSection;
  onSectionRestore: (sectionId: string) => void;
  t: TFunction;
  dividerAbove?: boolean;
};

const ArchivedSectionListItem: React.FC<Props> = (props) => {
  const { section, onSectionRestore, t, dividerAbove } = props;
  const classes = useStyle();
  const onIconClick = React.useCallback(
    () => onSectionRestore(section.section_id),
    [onSectionRestore, section.section_id],
  );

  return (
    <div className={classes.listItemContainer}>
      {dividerAbove && <Divider />}
      <div className={classes.listItem}>
        <MuiIcon icon={section.section_icon} />
        <div className={classes.title}>
          <Typography variant="body1">{section.section_name}</Typography>
          <Typography variant="caption">
            {`${section.items.length} ${t('sectionCard.item', {
              count: section.items.length,
            })}`}
          </Typography>
        </div>
        <IconButton onClick={onIconClick}>
          <RestoreFromTrash />
        </IconButton>
      </div>
      <Divider />
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  listItemContainer: {
    width: '100%',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
  },
}));

export default ArchivedSectionListItem;
