// @flow

import React from 'react';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import { deleteSnackbar } from './libs/snackbar/actions';
import type { Snack } from './libs/snackbar/types';

type Props = {
  messages: Snack[],
  deleteSnackbar: (id: number) => void,
};

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[900],
  },
}));

export const SnackbarPile = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['snackbar']);

  return (
    <div>
      {props.messages.map((snack) => (
        <Snackbar
          key={snack.id}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open
        >
          <SnackbarContent
            className={classes[snack.kind]}
            message={t(snack.message)}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => props.deleteSnackbar(snack.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Snackbar>
      ))}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    messages: state.snackbar.messages,
  };
}

const mapDispatchToProps = {
  deleteSnackbar,
};

export const SnackbarDataProvider = [mapStateToProps, mapDispatchToProps];

export default connect(...SnackbarDataProvider)(SnackbarPile);
