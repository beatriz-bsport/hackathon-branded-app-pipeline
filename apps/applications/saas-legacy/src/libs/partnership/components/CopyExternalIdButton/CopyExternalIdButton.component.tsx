import React from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IconButton } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CopyIcon from '#src/components/icons/CopyIcon.component';
import { snackbarSuccess } from '#src/libs/snackbar/actions';

type Props = {
  externalId: string;
  partnershipIdentifier: string;
  showSuccess: (message: string) => void;
};

const CopyExternalIdButton: React.FC<Props> = ({
  externalId,
  partnershipIdentifier,
  showSuccess,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('partnership');

  return (
    <CopyToClipboard
      onCopy={() =>
        showSuccess(
          t(`${partnershipIdentifier}.configuration.copied_to_clipboard`),
        )
      }
      text={externalId}
    >
      <IconButton
        aria-label="Copy to clipboard"
        className={classes.copyIcon}
        size="small"
      >
        <CopyIcon fontSize="small" />
      </IconButton>
    </CopyToClipboard>
  );
};

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.common.black,
    marginLeft: theme.spacing(0.5),
  },
}));

export default React.memo(
  connect(null, {
    showSuccess: snackbarSuccess,
  })(CopyExternalIdButton),
);
