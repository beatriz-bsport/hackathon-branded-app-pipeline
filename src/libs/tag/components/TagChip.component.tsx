import React from 'react';
import Chip from '@material-ui/core/Chip';
import {
  createMuiTheme,
  MuiThemeProvider,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import type { Tag, TagGroup } from '../types';
import MuiIcon from '../../../components/MuiIcon.component';

const newTheme = (color: string) =>
  createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
    },
  });

export const TagChip = (props: Props) => {
  const { tag, onDelete, onClick, variant, size } = props;
  const classes = useStyle();
  const companyTheme = useTheme();
  const theme = tag?.color ? newTheme(tag?.color) : companyTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <Chip
        classes={{
          label: classes.chipLabel,
          avatar: classes.avatar,
        }}
        label={`${tag?.group?.name} : ${tag?.name}`}
        size={size || 'medium'}
        color="primary"
        onDelete={onDelete}
        onClick={onClick}
        avatar={
          tag?.icon ? (
            <Avatar>
              <MuiIcon icon={tag.icon} className={classes.icon} />
            </Avatar>
          ) : null
        }
        variant={variant || 'default'}
      />
    </MuiThemeProvider>
  );
};

const useStyle = makeStyles((theme: Theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  chipLabel: {
    maxWidth: theme.spacing(20),
  },
  avatar: {
    backgroundColor: 'transparent!important',
  },
}));

type OwnProps = {
  tag: Tag<TagGroup>;
  onDelete?: () => void;
  variant?: 'default' | 'outlined';
  onClick?: () => void;
  size?: 'small' | 'medium';
};

type Props = OwnProps & WithTranslation;

export default compose<any, OwnProps>(withTranslation('tag'))(TagChip);
