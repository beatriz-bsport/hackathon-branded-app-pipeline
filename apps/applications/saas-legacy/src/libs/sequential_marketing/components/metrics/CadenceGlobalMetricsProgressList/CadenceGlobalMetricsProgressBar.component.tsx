import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import type { Theme } from '@material-ui/core/styles';

import ProgressBar from '#src/components/ProgressBar.component';
import {
  SequentialMarketingColors,
  CadenceMetricsSizes,
} from '#src/libs/sequential_marketing/constants';

type Props = {
  label: string;
  customColor?: string;
  count?: number;
  disabled?: boolean;
  width?: number;
  displayUpsellKnowMoreLink?: boolean;
  displayUpsellAvailableSoon?: boolean;
  upsellName?: string;
  onClickKnowMore?: () => void;
};

type StylesProps = {
  width?: number;
  customColor?: string;
  disabled?: boolean;
  minimumWidth?: boolean;
};

export const CadenceGlobalMetricsProgressBar: React.FC<Props> = ({
  label,
  customColor,
  count,
  disabled,
  width,
  displayUpsellKnowMoreLink,
  displayUpsellAvailableSoon,
  upsellName,
  onClickKnowMore,
}) => {
  const { t } = useTranslation('marketing');

  const minimumWidth = width < 5;
  const classes = useStyles({ width, customColor, disabled, minimumWidth });

  return (
    <div>
      <Typography className={classes.label} variant="body2">
        {label}
      </Typography>
      <div className={classes.progressBarContainer}>
        <div className={classes.progressBar}>
          <ProgressBar
            count={count ?? 0}
            customColor={
              customColor ?? SequentialMarketingColors.MARKETING_ACTION_COLOR
            }
            disabled={disabled}
            minimumWidth={minimumWidth}
          />
        </div>
        {disabled &&
          (displayUpsellAvailableSoon ? (
            <Typography variant="caption">
              {t('audience.workflowMetrics.communication.availableSoon')}
            </Typography>
          ) : (
            displayUpsellKnowMoreLink && (
              <Button
                className={classes.knowMoreButton}
                onClick={onClickKnowMore}
              >
                <div className={classes.knowMore}>
                  <Typography variant="caption">
                    {t('audience.workflowMetrics.communication.knowMore', {
                      upsell_name: upsellName,
                    })}
                  </Typography>
                  <OpenInNewIcon className={classes.openInNewIcon} />
                </div>
              </Button>
            )
          ))}
      </div>
    </div>
  );
};

export const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  label: {
    opacity: ({ disabled }) => (disabled ? 0.5 : 1),
  },
  progressBar: {
    width: ({ width, minimumWidth }) => (minimumWidth ? '100%' : `${width}%`),
  },
  progressBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: ({ customColor }) =>
      customColor ?? SequentialMarketingColors.MARKETING_ACTION_COLOR,
  },
  knowMoreButton: {
    textTransform: 'none',
    color: 'inherit',
    letterSpacing: 'inherit',
    fontWeight: 'inherit',
    padding: '0',
  },
  knowMore: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  openInNewIcon: {
    width: CadenceMetricsSizes.DISABLED_PROGRESS_BAR_OPEN_IN_NEW_ICON_WIDTH,
  },
}));

export default React.memo(CadenceGlobalMetricsProgressBar);
