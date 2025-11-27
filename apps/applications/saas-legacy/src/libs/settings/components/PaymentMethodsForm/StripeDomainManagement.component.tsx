import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/core/styles';

import type { StripeDomainListState } from '#src/libs/payment/types';

const MAX_DOMAINS = 10; // UI limit (backend limit is 15)

type StripeApiError = {
  response?: {
    status?: number;
    data?: {
      error_code?: number;
      error_message?: string;
      domain_name?: string | string[];
    };
  };
  message?: string;
};

type StripeDomainManagementProps = {
  stripeDomainList: StripeDomainListState;
  onRegisterDomain: (domainName: string, onSuccess?: () => void) => void;
};

const StripeDomainManagement: React.FC<StripeDomainManagementProps> = ({
  stripeDomainList,
  onRegisterDomain,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('b2b_settings');

  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');

  const {
    loading: domainsLoading,
    error: domainsError,
    items: domains,
    registerError,
  } = stripeDomainList;

  const getStatusColor = useCallback(
    (status: string): string => {
      const normalizedStatus = status?.toLowerCase() ?? '';
      switch (normalizedStatus) {
        case 'enabled':
          return theme.palette.success.light;
        case 'processing':
          return theme.palette.warning.light;
        default:
          return theme.palette.error.light;
      }
    },
    [theme],
  );

  useEffect(() => {
    if (!domainsLoading && domains.length === 0 && !isAddingDomain) {
      setIsAddingDomain(true);
    }
  }, [domains.length, domainsLoading, isAddingDomain]);

  const handleAddDomainClick = useCallback(() => {
    setIsAddingDomain(true);
    setNewDomainInput('');
  }, []);

  const handleSaveNewDomain = useCallback(() => {
    if (newDomainInput.trim()) {
      onRegisterDomain(newDomainInput.trim(), () => {
        setIsAddingDomain(false);
        setNewDomainInput('');
      });
    }
  }, [newDomainInput, onRegisterDomain]);

  return (
    <div className={classes.domainsContainer}>
      <Typography variant="h6">
        {t('paymentMethods.stripeDomains.title')}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        {t('paymentMethods.stripeDomains.subtitle')}
      </Typography>

      {domainsLoading && (
        <Box mb={2} mt={2}>
          <LinearProgress />
        </Box>
      )}

      {domainsError && (
        <Box mb={2} mt={2}>
          <Typography color="error" variant="body2">
            {t('paymentMethods.stripeDomains.errorLoading', {
              message: domainsError.message || 'Unknown error',
            })}
          </Typography>
        </Box>
      )}

      <div className={classes.domainListContainer}>
        <Alert className={classes.alert} severity="info">
          {t('paymentMethods.stripeDomains.infoMessage')}
        </Alert>

        {!domainsError &&
          domains.map((domain, index) => (
            <Fragment key={domain.id}>
              <Box className={classes.domainRow}>
                <TextField
                  className={classes.domainInput}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="small"
                  value={domain.domain_name}
                  variant="outlined"
                />
                <Chip
                  label={
                    domain.status.charAt(0).toUpperCase() +
                    domain.status.slice(1)
                  }
                  style={{
                    backgroundColor: getStatusColor(domain.status),
                    color: theme.palette.getContrastText(
                      getStatusColor(domain.status),
                    ),
                  }}
                />
              </Box>
              {(index < domains.length - 1 || isAddingDomain) && <Divider />}
            </Fragment>
          ))}

        {isAddingDomain && (
          <>
            <Box className={classes.domainRow}>
              <TextField
                autoFocus
                className={classes.domainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                placeholder={t('paymentMethods.stripeDomains.placeholder')}
                size="small"
                value={newDomainInput}
                variant="outlined"
              />
              <Tooltip
                title={t('paymentMethods.stripeDomains.saveTooltip') ?? ''}
              >
                <IconButton
                  color="primary"
                  disabled={!newDomainInput.trim()}
                  onClick={handleSaveNewDomain}
                  size="small"
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider />
          </>
        )}

        {registerError && (
          <Box mb={1} mt={1}>
            <Typography color="error" variant="caption">
              {(() => {
                const error = registerError as StripeApiError;
                const responseData = error?.response?.data;
                const status = error?.response?.status;

                // Handle custom error codes (HTTP 499)
                if (status === 499 && responseData?.error_code) {
                  const errorKey = `paymentMethods.stripeDomains.errors.${responseData.error_code}`;
                  const translatedError = t(errorKey);
                  // If translation returns the key itself, use the raw error message
                  return translatedError !== errorKey
                    ? translatedError
                    : responseData.error_message ||
                        t('paymentMethods.stripeDomains.errors.default');
                }

                // Handle validation errors (HTTP 400)
                if (status === 400 && responseData?.domain_name) {
                  return t('paymentMethods.stripeDomains.validationError');
                }

                return t('paymentMethods.stripeDomains.errors.default');
              })()}
            </Typography>
          </Box>
        )}
      </div>

      {domains.length > 0 && (
        <Button
          className={classes.addDomainButton}
          color="primary"
          disabled={isAddingDomain || domains.length >= MAX_DOMAINS}
          onClick={handleAddDomainClick}
          startIcon={<AddIcon />}
          variant="text"
        >
          {t('paymentMethods.stripeDomains.addButton')}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  domainsContainer: {
    marginTop: theme.spacing(3),
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  domainRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  domainInput: {
    width: '400px',
    marginRight: theme.spacing(2),
  },
  addDomainButton: {
    marginBottom: theme.spacing(4),
    textTransform: 'none',
  },
  domainListContainer: {
    maxWidth: '600px',
  },
}));

export default React.memo(StripeDomainManagement);
