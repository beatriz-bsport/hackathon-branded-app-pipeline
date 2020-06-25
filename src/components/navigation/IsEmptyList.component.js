// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';
import BottomActionsButton from '../button/BottomActionsButton.component';

type Props = {
  onCreate: () => void,
  text: String,
  button: String,
  onCreateLabel: String,
};
export const IsEmptyList = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.emptyTool}>
        <div className={classes.textAndIcon}>
          <InfoOutlined className={classes.leftIcon} fontSize="large" />
          <Typography variant="caption">{props.text}</Typography>
        </div>
        <div className={classes.buttonTool}>
          <Button variant="outlined" color="primary" onClick={props.onCreate}>
            {props.button}
          </Button>
        </div>
        <BottomActionsButton
          onCreate={props.onCreate}
          onCreateLabel={props.onCreateLabel}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTool: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    fontSize: 'large',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    maxWidth: 600,
  },
  textAndIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(3),
  },
  buttonTool: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default IsEmptyList;
