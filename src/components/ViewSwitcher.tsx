import React from 'react';
import { ButtonBase, makeStyles, Theme } from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ListIcon from '@material-ui/icons/List';
import clx from 'classnames';

interface Props {
  value: 'grid' | 'list';
  onChange: (value: 'grid' | 'list') => void;
}

export const ViewSwitcher: React.FC<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ButtonBase
        className={clx({
          [classes.item]: true,
          [classes.selected]: props.value === 'grid',
        })}
        onClick={() => props.onChange('grid')}
      >
        <ViewModuleIcon fontSize="large" />
      </ButtonBase>
      <ButtonBase
        className={clx({
          [classes.item]: true,
          [classes.selected]: props.value === 'list',
        })}
        onClick={() => props.onChange('list')}
      >
        <ListIcon fontSize="large" />
      </ButtonBase>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#888',
    borderRadius: 4,
    width: 80,
    overflow: 'hidden',
  },
  item: {
    paddingTop: theme.spacing(0.2),
    paddingBottom: theme.spacing(0.2),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    backgroundColor: 'white',
  },
  selected: {
    backgroundColor: '#888',
    color: 'white',
  },
}));

export default ViewSwitcher;
