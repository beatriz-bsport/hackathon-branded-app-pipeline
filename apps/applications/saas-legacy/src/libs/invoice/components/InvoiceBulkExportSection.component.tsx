import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import makeStyles from '@material-ui/styles/makeStyles';
import { TFunction } from 'i18next';
import React from 'react';
import TooltipInfo from '#src/components/TooltipInfo.component';

type Props = {
  isGenerateXmlBulkLoading: boolean;
  handleDownloadXmlBulk: () => void;
  t: TFunction;
};

const InvoiceBulkExportSection: React.FC<Props> = ({
  isGenerateXmlBulkLoading,
  handleDownloadXmlBulk,
  t,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.exportBulkSectionContainer}>
      <Button
        color="primary"
        onClick={handleDownloadXmlBulk}
        variant="outlined"
      >
        {isGenerateXmlBulkLoading ? (
          <CircularProgress className={classes.leftIcon} size={24} />
        ) : (
          <CloudUploadIcon className={classes.leftIcon} />
        )}
        {t('invoice:actions.downloadXmlBulk')}
      </Button>
      <TooltipInfo helpText={t('invoice:actions.downloadXmlBulkTooltip')} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  exportBulkSectionContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  leftIcon: { marginRight: theme.spacing(1) },
}));

export default React.memo(InvoiceBulkExportSection);
