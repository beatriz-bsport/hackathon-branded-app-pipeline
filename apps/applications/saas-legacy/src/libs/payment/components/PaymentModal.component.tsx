import React from 'react';
import { Theme, useTheme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Modal, useMediaQuery } from '@material-ui/core';

type OwnProps = {
  isOpen: boolean;
};
type Props = OwnProps;
export const PaymentModal: React.FC<Props> = ({ isOpen, children }) => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dialogOffset = fullScreen ? '0%' : '50%';
  return (
    <Modal open={isOpen}>
      <>
        <div
          className={classes.modal}
          style={{
            transform: `translate(-${dialogOffset}, -${dialogOffset})`,
            top: dialogOffset,
            left: dialogOffset,
            height: fullScreen ? '100%' : 'unset',
            width: fullScreen ? '100%' : 'unset',
          }}
        >
          <div className={classes.innerDialog}>{children}</div>
        </div>
      </>
    </Modal>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  innerDialog: { padding: theme.spacing(2) },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    overflow: 'auto',
    maxHeight: '100vh',
  },
}));
export default PaymentModal;
