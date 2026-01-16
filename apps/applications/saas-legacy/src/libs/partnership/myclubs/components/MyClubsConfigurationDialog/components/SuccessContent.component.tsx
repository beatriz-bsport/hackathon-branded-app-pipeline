import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';

import CopyExternalIdButton from '#src/libs/partnership/components/CopyExternalIdButton';
import { PartnershipIdentifier } from '#src/libs/partnership/types';

type Props = {
  partnershipIdentifier: PartnershipIdentifier;
  externalId: string;
  onClose: () => void;
};

const SuccessDialogContent: React.FC<Props> = ({
  partnershipIdentifier,
  externalId,
  onClose,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  return (
    <>
      <DialogContent className={classes.content}>
        <Typography variant="subtitle1">
          <Trans
            i18nKey={`${partnershipIdentifier}.configuration.dialog.helperTextCreateSuccess`}
            t={t}
          >
            Copy and paste this Partner ID into your
            <a
              className={classes.link}
              href="https://partner.myclubs.com/integrations"
              rel="noopener noreferrer"
              target="_blank"
            >
              myClubs account
            </a>
            to make the sessions in your selected establishments available to
            myClubs customers.
          </Trans>
        </Typography>
        <Typography variant="body2">
          {t(`${partnershipIdentifier}.configuration.dialog.field.externalId`, {
            externalId,
          })}
          <CopyExternalIdButton
            externalId={externalId}
            partnershipIdentifier={partnershipIdentifier}
          />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t(`${partnershipIdentifier}.configuration.dialog.action.close`)}
        </Button>
      </DialogActions>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gap: theme.spacing(2),
    width: '100%',
  },
  link: {
    display: 'inline',
    textDecoration: 'underline',
  },
}));

export default React.memo(SuccessDialogContent);
