import React from 'react';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CancelIcon from '@material-ui/icons/Cancel';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '#src/components/Tooltip.component';
import type {
  QuickbooksApp,
  QuickBooksTaxCode,
} from '#src/libs/quickbooks/types';

type Props = {
  loading: boolean;
  upsertLoading: boolean;
  quickbooksApp: QuickbooksApp;
  taxCodesList: QuickBooksTaxCode[];
  submitTaxCodeSelection: (data: {
    tax_code: { name: string; value: string };
  }) => void;
  handleRefreshQuickBooksTaxData: () => void;
};
export const QuickBooksTaxSection: React.FC<Props> = ({
  loading,
  upsertLoading,
  quickbooksApp,
  taxCodesList,
  submitTaxCodeSelection,
  handleRefreshQuickBooksTaxData,
}) => {
  const { t } = useTranslation('settings');
  const classes = useStyles();
  const [taxSelected, setTaxSelected] = React.useState(null);

  React.useEffect(() => {
    if (quickbooksApp?.metadata?.tax_code?.value) {
      setTaxSelected(quickbooksApp.metadata.tax_code.value);
    } else {
      setTaxSelected(null);
    }
  }, [quickbooksApp, setTaxSelected]);

  const handleSubmitTaxCodeSelection = (taxCode: QuickBooksTaxCode) => {
    if (taxSelected !== taxCode.Id) {
      return submitTaxCodeSelection({
        tax_code: { name: taxCode.Name, value: taxCode.Id },
      });
    }
    return null;
  };
  if (
    !quickbooksApp.multi_currency_support ||
    !quickbooksApp.is_configured ||
    quickbooksApp.is_disabled
  ) {
    return null;
  }
  return (
    <>
      <div className={classes.header}>
        <Typography variant="h5">{t('quickbooks.tax.taxInfoTitle')}</Typography>

        <Tooltip title={t('quickbooks.tax.refresh')}>
          <IconButton
            disabled={upsertLoading || loading}
            onClick={handleRefreshQuickBooksTaxData}
          >
            <RefreshIcon
              className={clsx({
                [classes.rotateIcon]: upsertLoading || loading,
              })}
            />
          </IconButton>
        </Tooltip>
      </div>
      {!taxSelected && !loading && !upsertLoading && (
        <Alert className={classes.alert} severity="warning" variant="outlined">
          {t('quickbooks.tax.alertUnconfigured')}
        </Alert>
      )}
      {taxCodesList?.length !== 0 ? (
        <TableContainer>
          <Table size="small">
            <>
              <TableHead>
                <TableRow>
                  <TableCell>{t('quickbooks.tax.taxCodeHeaderName')}</TableCell>

                  <TableCell>
                    {t('quickbooks.tax.taxCodeHeaderDescription')}
                  </TableCell>
                  <TableCell align="center">
                    {t('quickbooks.tax.usedAsTaxCode')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(taxCodesList ?? []).map((taxCode) => (
                  <TableRow
                    key={`tax_code_row_${taxCode?.Id}`}
                    classes={{ root: classes.MuiRowRoot }}
                    onClick={() => handleSubmitTaxCodeSelection(taxCode)}
                  >
                    <TableCell>{taxCode?.Name}</TableCell>
                    <TableCell>{taxCode?.Description}</TableCell>
                    <TableCell align="center" padding="none" size="small">
                      {taxCode.Id === taxSelected ? (
                        <DoneAllIcon className={classes.greenIcon} />
                      ) : (
                        <CancelIcon />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          </Table>
        </TableContainer>
      ) : (
        <div className={classes.paddingTop}>
          <Alert
            action={
              <Tooltip title={t('quickbooks.tax.refresh')}>
                <IconButton
                  disabled={upsertLoading || loading}
                  onClick={handleRefreshQuickBooksTaxData}
                >
                  <RefreshIcon
                    className={clsx({
                      [classes.rotateIcon]: upsertLoading || loading,
                    })}
                  />
                </IconButton>
              </Tooltip>
            }
            className={classes.alert}
            severity="info"
            variant="outlined"
          >
            {t('quickbooks.tax.alertNonTaxInformation')}
          </Alert>
        </div>
      )}
    </>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  MuiRowRoot: {
    '&:hover': {
      backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    },
  },
  greenIcon: {
    color: green[600],
  },
  header: {
    display: 'flex',
    flexDiretion: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  '@keyframes RotationEffect': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '50%': {
      transform: 'rotate(180)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  rotateIcon: {
    animation: '$RotationEffect 0.75s infinite',
  },
  alert: {
    alignItems: 'center',
  },
  paddingTop: {
    paddingTop: theme.spacing(2),
  },
}));
export default QuickBooksTaxSection;
