// @ts-nocheck
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
  downloadContractTerms: (options: OptionCallback) => void;
  open: boolean;
  contractTermsLink?: string;
};

const ContractTermsDialog = (props: Props) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const onSuccess = () => {
    setIsProcessing(false);
    props.closeContractTermsDialog();
  };
  const onError = () => {
    setIsProcessing(false);
  };
  // If we don't have already a link to the pdf file, or if we want to force retrieve the last version
  // for contract checkout, props.contractTermsLink should be undefined and a fetch will be done to the back
  const onDownloadClick = () => {
    if (props.contractTermsLink) {
      downloadDocument(props.contractTermsLink);
      props.closeContractTermsDialog();
    } else {
      setIsProcessing(true);
      props.downloadContractTerms({ onSuccess, onError });
    }
  };
  const classes = useStyles();
  return (
    <CustomMuiDialog
      open={props.open}
      buttons={[
        {
          commonLabel: 'close',
          onClick: props.closeContractTermsDialog,
          variant: 'text',
        },
        {
          commonLabel: 'download',
          startIcon: <DownloadIcon />,
          onClick: onDownloadClick,
          color: 'primary',
          variant: 'contained',
          disabled: isProcessing,
        },
      ]}
      withButtonsDivider
    >
      <div className={classes.container}>
        <TypographyMultiline>{props.contractTerms}</TypographyMultiline>
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

export default ContractTermsDialog;
