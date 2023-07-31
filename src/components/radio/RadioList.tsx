import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import { RadioItem } from './RadioItem';

type ID = { id: number | string };

type Props<S extends ID> = {
  data: S[];
  selected?: number | string | null;
  onClick: (item: S, index: number) => void;
  renderItem: (item: S, index: number) => any;
};

const RadioList = <S extends ID>(props: React.PropsWithChildren<Props<S>>) => {
  const classes = useStyles();

  return (
    <div className={classes.itemsListContainer}>
      {props.data.map((item, i) => (
        <RadioItem
          key={i}
          selected={props.selected === item.id}
          onClick={() => props.onClick(item, i)}
          bottomBorder={i !== props.data.length - 1}
          renderItem={() => props.renderItem(item, i)}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  itemsListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default RadioList;
