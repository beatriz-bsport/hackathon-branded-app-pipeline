import React, { useCallback, useState } from 'react';
import Alert from '@material-ui/lab/Alert/Alert';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import FranchiseNotificationRuleCard from './FranchiseNotificationRuleCard.component';
import FranchiseNotificationRuleFormModal from './FranchiseNotificationRuleFormModal.component';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
// @ts-expect-error
import { FranchiseCompleteNotificationRule } from '../../notification-rule/types';
import { FranchiseCompany } from '../types';
import { OptionCallback } from '../../../state/types';

type OwnProps = {
  emailDesignList: EmailTemplateSummary[];
  companies: FranchiseCompany[];
  previewEmail: Record<string, EmailTemplateDetail>;
  rules: FranchiseCompleteNotificationRule[];
  notificationId: number;
  fetchEmailDesignDetail: (id: number) => void;
  handleDelete: (id: number) => () => void;
  handleEdit: (
    id: number,
  ) => (
    data: Omit<FranchiseCompleteNotificationRule, 'id'>,
    options: OptionCallback,
  ) => void;
  handleCreate: (
    data: Omit<FranchiseCompleteNotificationRule, 'id'>,
    options: OptionCallback,
  ) => void;
  handleFetchPreview: (emailId: number) => void;
  selectedPreviewEmail?: number;
  requiredTagsByEvent: { [key: number]: string[] };
};
type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export const FranchiseNotificationRuleDetails = (props: Props) => {
  const {
    emailDesignList,
    companies,
    previewEmail,
    rules,
    notificationId,
    fetchEmailDesignDetail,
    handleDelete,
    handleEdit,
    handleFetchPreview,
    handleCreate,
    selectedPreviewEmail,
    requiredTagsByEvent,
    classes,
    t,
  } = props;

  const [create, setCreate] = useState(false);

  const [showAlertForCreation, setShowAlertForCreation] = useState(false);

  const usedCompanies = rules.reduce<number[]>(
    (acc, rule) => [...acc, ...rule.companies],
    [],
  );

  const getAvailableCompanies = React.useCallback(
    (defaultAvailable?: FranchiseCompany[]) => {
      const availableCompanies = [
        ...companies.filter((c) => !usedCompanies.includes(c.id)),
      ];
      if (defaultAvailable) {
        return [...defaultAvailable, ...availableCompanies];
      }

      return availableCompanies;
    },
    [companies, usedCompanies],
  );

  const closeModal = useCallback(() => {
    setCreate(false);
  }, [setCreate]);

  const showAlert = useCallback(
    () => setShowAlertForCreation(true),
    [setShowAlertForCreation],
  );

  const handleSubmit: (
    data: Omit<FranchiseCompleteNotificationRule, 'id'>,
  ) => void = useCallback(
    (data) => {
      handleCreate(data, { onError: showAlert, onSuccess: closeModal });
    },
    [handleCreate, showAlert, closeModal],
  );

  const onModalClose = useCallback(() => {
    setCreate(false);
    setShowAlertForCreation(false);
  }, [setCreate, setShowAlertForCreation]);

  const onClickAddConfiguration = useCallback(() => {
    setCreate(true);
    setShowAlertForCreation(false);
  }, [setCreate, setShowAlertForCreation]);

  return (
    <>
      {!notificationId && (
        <div className={classes.emptySelect}>
          <Alert className={classes.alertInfo} severity="info">
            {t('franchise.emptySelect')}
          </Alert>
        </div>
      )}
      {!!notificationId && (
        <div>
          <Typography variant="h4">
            {t(`eventType.${notificationId}`)}
          </Typography>
          <div className={classes.divider} />
          {rules.length > 0 && (
            <>
              <Button
                className={classes.button}
                color="primary"
                disabled={
                  getAvailableCompanies().filter((c) => c.isAllowed).length ===
                  0
                }
                onClick={onClickAddConfiguration}
                variant="contained"
              >
                {t('franchise.addConfiguration')}
              </Button>

              {rules.map((rule) => {
                return (
                  <FranchiseNotificationRuleCard
                    key={rule.id}
                    companies={getAvailableCompanies(
                      companies.filter((c) => rule.companies.includes(c.id)),
                    )}
                    emailDesignList={emailDesignList}
                    fetchPreview={fetchEmailDesignDetail}
                    // @ts-expect-error
                    notificationId={notificationId}
                    onDelete={handleDelete(rule.id)}
                    onEdit={handleEdit(rule.id)}
                    previewEmail={previewEmail}
                    requiredTagsByEvent={requiredTagsByEvent}
                    rule={rule}
                  />
                );
              })}
            </>
          )}
          {rules.length === 0 && (
            <>
              <div className={classes.emptyState}>
                <div className={classes.flex}>
                  <ErrorOutlineIcon className={classes.emptyIcon} />
                  {t('franchise.emptyStateConfiguration')}
                </div>
              </div>
              <div className={classes.inverseFlex}>
                <Button
                  className={classes.emptyButton}
                  color="primary"
                  onClick={onClickAddConfiguration}
                  variant="outlined"
                >
                  {t('franchise.addConfiguration')}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {create && (
        <FranchiseNotificationRuleFormModal
          open
          companies={getAvailableCompanies()}
          emailTemplates={emailDesignList}
          notification_event={notificationId}
          onClose={onModalClose}
          onSubmit={handleSubmit}
          previewEmail={previewEmail?.[selectedPreviewEmail]}
          refreshEmailPreview={handleFetchPreview}
          requiredTagsByEvent={requiredTagsByEvent}
          showAlert={showAlertForCreation}
        />
      )}
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    alertInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    emptySelect: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    info: {
      marginBottom: theme.spacing(2),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.palette.divider,
      marginTop: theme.spacing(1),
    },
    button: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    emptyState: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    flex: {
      display: 'flex',
      alignItem: 'center',
    },
    emptyIcon: {
      marginRight: theme.spacing(2),
    },
    emptyButton: {
      marginTop: theme.spacing(1),
      marginLeft: 'auto',
    },
    inverseFlex: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['notificationRule']),
  withStyles(styles),
)(FranchiseNotificationRuleDetails);
