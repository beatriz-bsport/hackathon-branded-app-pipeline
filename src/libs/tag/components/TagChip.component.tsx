import React from 'react';
import Chip from '@material-ui/core/Chip';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { compose } from 'recompose';
import Avatar from '@material-ui/core/Avatar';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  WithStyles,
  withStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core';
import type { Tag, TagGroup } from '../types';

const newTheme = (color: string) =>
  createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
    },
  });

const makeAvatar = (icon: string, classes: Object) => {
  return <Avatar className={classes.avatar} src={icon} />;
};

export const TagChip = (props: Props) => {
  const { tag, onDelete, onClick, variant, classes, size } = props;
  const companyTheme = useTheme();
  const theme = tag.color ? newTheme(tag.color) : companyTheme;
  return (
    <MuiThemeProvider theme={theme}>
      <Chip
        label={`${tag.group.name} : ${tag.name}`}
        size={size || 'medium'}
        color="primary"
        onDelete={onDelete}
        onClick={onClick}
        avatar={tag.icon ? makeAvatar(tag.icon, classes) : null}
        variant={variant || 'default'}
      />
    </MuiThemeProvider>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: theme.spacing(2),
    },
  });

type OwnProps = {
  tag: Tag<TagGroup>;
  onDelete?: () => void;
  variant?: 'default' | 'outlined';
  onClick?: () => void;
  size?: 'small' | 'medium';
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export default compose<any, OwnProps>(
  withTranslation('tag'),
  withStyles(styles),
)(TagChip);
