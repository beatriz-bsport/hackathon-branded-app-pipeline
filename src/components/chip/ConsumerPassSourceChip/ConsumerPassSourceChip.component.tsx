import React from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import createTheme from '@material-ui/core/styles/createTheme';
import useTheme from '@material-ui/core/styles/useTheme';
import Tooltip from '#src/components/Tooltip.component';

type Props = {
  companySourceName?: string;
  companySourcePrimaryColor?: string;
  tooltipText?: string;
};

/**
 * Render a chip based indicating the source of the consumer payment pack, or the private consumer pass.
 *
 * If the consumer pack has information on the company source name and its primary color,
 * it creates a themed chip using MuiThemeProvider with the specified color.
 * If not, it renders a default chip with a label indicating that
 * the payment pack is shared from another franchisee.
 *
 * @returns {JSX.Element} Chip indicating the source of the consumer pass.
 */
const ConsumerPassSourceChip: React.FC<Props> = ({
  companySourceName,
  companySourcePrimaryColor,
  tooltipText,
}) => {
  const { t } = useTranslation('paymentPack');

  const defaultTheme = useTheme();

  const companySourceTheme = companySourcePrimaryColor
    ? createTheme({
        palette: {
          primary: {
            main: companySourcePrimaryColor,
          },
        },
      })
    : defaultTheme;

  return (
    <MuiThemeProvider theme={companySourceTheme}>
      {companySourceName ? (
        <Tooltip title={tooltipText}>
          <Chip color="primary" label={companySourceName} />
        </Tooltip>
      ) : (
        <Chip
          color="primary"
          label={t(
            'paymentPackTemplateInstance.consumerPaymentPackSharedFromOtherFranchisee',
          )}
        />
      )}
    </MuiThemeProvider>
  );
};

export default React.memo(ConsumerPassSourceChip);
