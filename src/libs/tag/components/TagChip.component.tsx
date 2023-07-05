import React from 'react';
import Chip from '@material-ui/core/Chip';
import {
  createTheme,
  MuiThemeProvider,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import type { Tag, TagGroup } from '../types';
import MuiIcon from '#components/MuiIcon.component';

type Props = {
  tag: Tag<TagGroup>;
  onDelete?: () => void;
  variant?: 'default' | 'outlined';
  onClick?: () => void;
  size?: 'small' | 'medium';
  deleteOnClick?: boolean;
};

const newTheme = (color: string) =>
  createTheme({
    palette: {
      primary: {
        main: color,
      },
    },
  });

export const TagChip: React.FC<Props> = ({
  tag,
  onDelete,
  onClick,
  variant,
  size,
  deleteOnClick,
}) => {
  const classes = useStyle({ deleteOnClick });
  const companyTheme = useTheme();
  const theme = tag?.color ? newTheme(tag?.color) : companyTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <Chip
        classes={{
          root: classes.root,
          avatar: classes.avatar,
        }}
        label={`${tag?.group?.name} : ${tag?.name}`}
        size={size || 'medium'}
        color="primary"
        onDelete={onDelete}
        onClick={deleteOnClick ? onDelete : onClick}
        avatar={
          tag?.icon ? (
            <Avatar>
              <MuiIcon icon={tag.icon} className={classes.icon} />
            </Avatar>
          ) : null
        }
        variant={variant || 'default'}
        className={classes.chip}
        clickable
      />
    </MuiThemeProvider>
  );
};

const useStyle = makeStyles<Theme, { deleteOnClick: boolean }>((theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  chip: {
    maxWidth: '100%',
  },
  avatar: {
    backgroundColor: 'transparent!important',
  },
}));

export default React.memo(TagChip);
