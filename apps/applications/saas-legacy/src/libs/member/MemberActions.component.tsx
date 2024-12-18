import React, { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import makeStyles from '@material-ui/core/styles/makeStyles';
import HelpIcon from '@material-ui/icons/Help';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LEAD_MANAGEMENT_IMPORT_INTERCOM_URL } from '#src/libs/member/constants';

import MemberActionsImportLeads from './MemberActionsImportLeads.component';

type Props = {
  addMember?: () => void;
  importZohoLeads?: (file: File) => void;
  isUploadingLeadManagementFile?: boolean;
};

const MemberActions: React.FC<Props> = ({
  addMember,
  importZohoLeads,
  isUploadingLeadManagementFile,
}) => {
  const { t } = useTranslation('member');

  const classes = useStyles();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const [isNotCSVFile, setIsNotCSVFile] = useState<boolean>(false);

  const openFileBrowser = useCallback(() => inputFileRef?.current?.click(), []);

  const handleFileChange = useCallback(() => {
    if (inputFileRef.current?.files?.length > 0) {
      const file = inputFileRef.current.files[0];
      if (file?.type === 'text/csv' || file?.name.endsWith('.csv')) {
        setIsNotCSVFile(false);
        importZohoLeads?.(file);
      } else {
        setIsNotCSVFile(true);
      }
      inputFileRef.current.value = '';
    }
  }, [importZohoLeads]);

  const goToIntercomPage = useCallback(() => {
    window.open(LEAD_MANAGEMENT_IMPORT_INTERCOM_URL, '_blank');
  }, []);

  return (
    <div className={classes.container}>
      <Button color="primary" onClick={addMember} variant="contained">
        <AddIcon className={classes.leftIcon} />
        {t('addMember')}
      </Button>
      {!!importZohoLeads && (
        <>
          <Button
            className={classes.buttonSpacing}
            color="primary"
            disabled={isUploadingLeadManagementFile}
            onClick={openFileBrowser}
            variant="outlined"
          >
            {isUploadingLeadManagementFile ? (
              <CircularProgress
                className={classes.leftIcon}
                color="inherit"
                size={24}
              />
            ) : (
              <CloudUploadIcon className={classes.leftIcon} />
            )}
            {t('leads.import')}
          </Button>
          <input
            ref={inputFileRef}
            className={classes.hideInput}
            id="file"
            onChange={handleFileChange}
            type="file"
          />
          <Button
            className={classes.intercomButton}
            color="primary"
            onClick={goToIntercomPage}
            variant="outlined"
          >
            <HelpIcon />
          </Button>

          <MemberActionsImportLeads.NotACSV
            dialogOpen={isNotCSVFile}
            setDialogOpen={setIsNotCSVFile}
          />
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  intercomButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.7),
    paddingBottom: theme.spacing(0.7),
    marginRight: theme.spacing(1),
    minWidth: 'auto',
  },
  hideInput: {
    display: 'none',
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(MemberActions);
