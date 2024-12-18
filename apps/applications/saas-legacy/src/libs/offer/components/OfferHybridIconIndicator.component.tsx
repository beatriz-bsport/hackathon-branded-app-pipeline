import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/styles/makeStyles';
import ApartmentIcon from '@material-ui/icons/Apartment';
import VideocamIcon from '@material-ui/icons/Videocam';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import ToolTip from '#src/components/Tooltip.component';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';

type Props = {
  iconProps: SvgIconProps;
};

export const OfferIconHybridIndicator: React.FC<Props> = React.memo(
  ({ iconProps }) => {
    const { t } = useTranslation('offer');
    const classes = useStyles();
    return (
      <ToolTip title={t('form.section.specificities.field.hybridSection')}>
        <div className={classes.row}>
          <CustomMuiIcon
            MuiIcon={ApartmentIcon}
            MuiIconProps={{ ...iconProps }}
          />
          /
          <CustomMuiIcon
            MuiIcon={VideocamIcon}
            MuiIconProps={{ ...iconProps }}
          />
        </div>
      </ToolTip>
    );
  },
);

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

OfferIconHybridIndicator.defaultProps = {
  iconProps: { fontSize: 'small' },
};
export default OfferIconHybridIndicator;
