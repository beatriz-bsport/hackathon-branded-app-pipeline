import React, { useState } from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button, createStyles, Theme, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import FranchiseNotificationRuleCard from './FranchiseNotificationRuleCard.component';
import FranchiseNotificationRuleFormModal from './FranchiseNotificationRuleFormModal.component';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { FranchiseCompleteNotificationRule } from '../../notification-rule/types';
import { FranchiseCompany } from '../types';

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
  ) => (data: Omit<FranchiseCompleteNotificationRule, 'id'>) => void;
  handleCreate: (data: Omit<FranchiseCompleteNotificationRule, 'id'>) => void;
  handleFetchPreview: (emailId: number) => void;
  selectedPreviewEmail?: number;
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
    classes,
    t,
  } = props;

  const [create, setCreate] = useState(false);

  const usedCompanies = rules.reduce<number[]>(
    (acc, rule) => [...acc, ...rule.companies],
    [],
  );

  const getAvailableCompanies = (defaultAvailable?: FranchiseCompany[]) => {
    const availableCompanies = [
      ...companies.filter((c) => !usedCompanies.includes(c.id)),
    ];
    if (defaultAvailable) {
      return [...defaultAvailable, ...availableCompanies];
    }

    return availableCompanies;
  };

  return (
    <>
      {!notificationId && (
        <div className={classes.emptySelect}>
          <InfoIcon className={classes.info} />
          <div>
            <Typography variant="body1">
              {t('franchise.emptySelect')}
            </Typography>
          </div>
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
                variant="contained"
                color="primary"
                onClick={() => setCreate(true)}
                disabled={getAvailableCompanies().length === 0}
              >
                {t('franchise.addConfiguration')}
              </Button>

              {rules.map((rule) => (
                <FranchiseNotificationRuleCard
                  key={rule.id}
                  rule={rule}
                  companies={getAvailableCompanies(
                    companies.filter((c) => rule.companies.includes(c.id)),
                  )}
                  notificationId={notificationId}
                  previewEmail={previewEmail}
                  emailDesignList={emailDesignList}
                  onDelete={handleDelete(rule.id)}
                  onEdit={handleEdit(rule.id)}
                  fetchPreview={fetchEmailDesignDetail}
                />
              ))}
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
                  variant="outlined"
                  color="primary"
                  onClick={() => setCreate(true)}
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
          onSubmit={(data) => {
            handleCreate(data);
            setCreate(false);
          }}
          onClose={() => setCreate(false)}
          notification_event={notificationId}
          previewEmail={previewEmail?.[selectedPreviewEmail]}
          refreshEmailPreview={handleFetchPreview}
        />
      )}
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
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
