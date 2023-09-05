// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import BottomActionsButton from '../button/BottomActionsButton.component';

type Props = {
  onCreate: () => void;
  text: string;
  button?: string;
  onCreateLabel?: string;
  filledIcon?: boolean;
  hideEmptyText?: boolean;
  hideBottomActions?: boolean;
};
export const IsEmptyList = (props: Props) => {
  const classes = useStyles(props);
  return (
    <>
      {!props.hideEmptyText && (
        <div className={classes.container}>
          <div className={classes.emptyTool}>
            <div className={classes.textAndIcon}>
              {props.filledIcon ? (
                <InfoIcon className={classes.leftIcon} fontSize="large" />
              ) : (
                <InfoOutlined className={classes.leftIcon} fontSize="large" />
              )}
              <Typography variant="body1">{props.text}</Typography>
            </div>
            <div className={classes.buttonTool}>
              {props.button && (
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={props.onCreate}
                  variant="outlined"
                >
                  <AddIcon color="primary" />
                  {props.button}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {!props.hideBottomActions && (
        <BottomActionsButton
          onCreate={props.onCreate}
          onCreateLabel={props.onCreateLabel}
        />
      )}
    </>
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
    alignItems: 'center',
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
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default IsEmptyList;
