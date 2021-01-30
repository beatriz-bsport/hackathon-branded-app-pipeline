import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { snackbarSuccess } from 'bsport-saas/src/actions/snackbar.actions';

const useEventListener = (event, handler, passive = false) => {
  React.useEffect(() => {
    window.addEventListener(event, handler, passive);
    return function cleanup() {
      window.removeEventListener(event, handler);
    };
  });
};

export const TheIframe = (props: { url?: string, onClose: () => void }) => {
  useEventListener(
    'message',
    (event: any) => {
      if (event.data && event.data.type === 'paymentSuccess') {
        props.success('snackbar:consumerPass.success');
        props.onClose();
      }
    },
    false,
  );
  const classes = useStyles();

  if (!props.url) return null;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer} open onClose={props.onClose}>
        <div className={classes.topBar}>
          <IconButton onClick={props.onClose}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <iframe
          title="bsport-inner-modal"
          className={classes.iframe}
          src={props.url}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2147483647,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.2)',
  },
  innerContainer: {
    maxHeight: 720,
    maxWidth: 768,
    width: '100%',
    height: '100%',
  },
  topBar: {
    display: 'flex',
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iframe: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,

    height: '100%',
    width: '100%',
  },
}));

export default connect(null, {
  success: (s: string) => snackbarSuccess(s),
})(TheIframe);
