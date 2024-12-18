import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import CustomMuiDialog from '#src/components/genericDialog/CustomMuiDialog.component';
import {
  ONE_HUNDRED,
  ONE_MILLION,
  TEN_THOUSANDS,
} from '#src/libs/communication/constants';

type Props = {
  recipientsCount: number;
  open: boolean;
  handleClose: () => void;
  exportAllCampaignsBackground: () => void;
};

export const CampaignsExportLimitDialog: React.FC<Props> = ({
  recipientsCount,
  open,
  handleClose,
  exportAllCampaignsBackground,
}) => {
  const { t } = useTranslation('communication');

  const handleGenerateAnyway = React.useCallback(() => {
    exportAllCampaignsBackground();
    handleClose();
  }, [exportAllCampaignsBackground, handleClose]);

  const buttons = [
    {
      commonLabel: 'cancel',
      variant: 'text',
      color: 'default',
      onClick: handleClose,
    },
    {
      label: t('campaign.exportCampaigns.dialogButtonGenerateAnyway'),
      variant: 'text',
      color: 'primary',
      onClick: handleGenerateAnyway,
    },
  ];

  const difference = recipientsCount - ONE_MILLION;
  // Difference between the count and the limit of xlsx files

  const formatedTotalCount =
    Math.round(recipientsCount / TEN_THOUSANDS) / ONE_HUNDRED;
  // We format it this way to keep the coma after the round. Number will be like x.yz millions

  const isDifferenceLowerThanTenThousands = React.useMemo(() => {
    return difference > 0 && difference < TEN_THOUSANDS;
  }, [difference]);
  // We want to display the exact difference only if it is lower than tenthousands
  // Otherwise, we can see the difference thanks to the format of the number

  return (
    <CustomMuiDialog
      buttons={buttons}
      contentAlign="left"
      open={open}
      title={t('campaign.exportCampaigns.dialogTitle')}
    >
      <>
        <Typography color="textPrimary" variant="body1">
          {t('campaign.exportCampaigns.dialogContent', {
            count: formatedTotalCount,
          })}
          {isDifferenceLowerThanTenThousands &&
            t('campaign.exportCampaigns.dialogContentSurplus', {
              difference_count: difference,
            })}
        </Typography>
        <Typography color="textPrimary" variant="body1">
          {t('campaign.exportCampaigns.dialogContentAlternative')}
        </Typography>
      </>
    </CustomMuiDialog>
  );
};

export default React.memo(CampaignsExportLimitDialog);
