import React from 'react';
import DownloadIcon from '@material-ui/icons/GetApp';
import { makeStyles, Theme } from '@material-ui/core';
import { downloadDocument } from '../../../../utils/downloader';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';
import { OptionCallback } from '../../../../state/types';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';

type Props = {
  closeContractTermsDialog: () => void;
  contractTerms: string;
  downloadContractTerms?: (options: OptionCallback) => void;
  open: boolean;
  contractTermsLink?: string;
};

const ContractTermsDialog: React.FC<Props> = ({
  closeContractTermsDialog,
  contractTerms,
  downloadContractTerms,
  open,
  contractTermsLink,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onSuccess = React.useCallback(() => {
    setIsProcessing(false);
    closeContractTermsDialog();
  }, [closeContractTermsDialog]);

  const onError = React.useCallback(() => {
    setIsProcessing(false);
  }, []);

  // If we don't have already a link to the pdf file, or if we want to force retrieve the last version
  // for contract checkout, contractTermsLink should be undefined and a fetch will be done to the back
  const onDownloadClick = React.useCallback(() => {
    if (contractTermsLink) {
      downloadDocument(contractTermsLink);
      closeContractTermsDialog();
    } else {
      setIsProcessing(true);
      downloadContractTerms?.({ onSuccess, onError });
    }
  }, [
    closeContractTermsDialog,
    contractTermsLink,
    downloadContractTerms,
    onError,
    onSuccess,
  ]);

  const classes = useStyles();

  return (
    <CustomMuiDialog
      open={open}
      buttons={[
        {
          commonLabel: 'close',
          onClick: closeContractTermsDialog,
          variant: 'text',
        },
        ...(downloadContractTerms || contractTermsLink
          ? [
              {
                commonLabel: 'download',
                startIcon: <DownloadIcon />,
                onClick: onDownloadClick,
                color: 'primary',
                variant: 'contained',
                disabled: isProcessing,
              },
            ]
          : []),
      ]}
      withButtonsDivider
    >
      <div className={classes.container}>
        <TypographyMultiline>{contractTerms}</TypographyMultiline>
      </div>
    </CustomMuiDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.up('md')]: {
      maxHeight: 500,
    },
  },
}));

export default React.memo(ContractTermsDialog);
