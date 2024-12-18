import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import type { FranchiseUserTag } from '#src/libs/franchise/types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import MuiIcon from '#src/components/MuiIcon.component';
import useTheme from '@material-ui/styles/useTheme';
import createTheme from '@material-ui/core/styles/createTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';

type Props = {
  tag: FranchiseUserTag;
  isLast: boolean;
};

const newTheme = (color: string) =>
  createTheme({
    palette: {
      primary: {
        main: color,
      },
    },
  });

const FranchiseMemberTagListItem: React.FC<Props> = ({ tag, isLast }) => {
  const classes = useStyles();
  const companyTheme = useTheme();
  const theme = tag?.sub_tag.color ? newTheme(tag.sub_tag.color) : companyTheme;

  return (
    <ListItem
      key={tag.id}
      disableGutters
      className={classNames(classes.listItem, {
        [classes.lastItem]: isLast,
      })}
    >
      <Typography variant="subtitle2">{tag.tag_group.name}</Typography>
      <MuiThemeProvider theme={theme}>
        <Chip
          avatar={
            tag?.sub_tag.icon && (
              <Avatar>
                <MuiIcon className={classes.icon} icon={tag.sub_tag.icon} />
              </Avatar>
            )
          }
          classes={{
            avatar: classes.avatar,
          }}
          color="primary"
          label={tag.sub_tag.name}
        ></Chip>
      </MuiThemeProvider>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    alignSelf: 'stretch',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  lastItem: {
    borderBottom: 'none',
  },
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  avatar: {
    backgroundColor: 'transparent!important',
  },
}));

export default React.memo(FranchiseMemberTagListItem);
