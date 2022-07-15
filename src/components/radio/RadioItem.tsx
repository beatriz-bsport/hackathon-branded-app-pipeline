import React from 'react';
import { ButtonBase, makeStyles, Radio, Theme } from '@material-ui/core';

type Props = {
  selected: boolean;
  onClick: () => void;
  bottomBorder?: boolean;
  renderItem: any;
  disabled?: boolean;
};

export const RadioItem = (props: Props) => {
  const classes = useStyles();

  return (
    <ButtonBase
      className={classes.itemContainer}
      onClick={() => props.onClick()}
      disabled={!!props.disabled}
    >
      <div
        className={`${classes.itemContainer} ${
          props.bottomBorder ? classes.borderBottom : ''
        }`}
      >
        <Radio
          disabled={!!props.disabled}
          checked={props.selected}
          onClick={props.onClick}
        />
        <div className={classes.itemContent}>{props.renderItem()}</div>
      </div>
    </ButtonBase>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // Allow tooltip inside disabled button base
    pointerEvents: 'auto',
  },
  itemContent: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  borderBottom: {
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
}));
