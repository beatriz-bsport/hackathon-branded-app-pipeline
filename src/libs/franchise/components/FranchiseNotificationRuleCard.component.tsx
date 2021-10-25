// @flow
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { FranchiseCompany } from '../types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import FranchiseNotificationRuleFormModal from './FranchiseNotificationRuleFormModal.component';
import { FranchiseCompleteNotificationRule } from '../../notification-rule/types';

export type OwnProps = {
  rule: FranchiseCompleteNotificationRule;
  companies: FranchiseCompany[];
  notificationId: number;
  previewEmail: Record<string, EmailTemplateDetail>;
  emailDesignList: EmailTemplateSummary[];
  fetchPreview: (id: number) => void;
  onDelete: () => void;
  onEdit: (data: Omit<FranchiseCompleteNotificationRule, 'id'>) => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseNotificationRuleCard = (props: Props) => {
  const {
    rule,
    companies,
    classes,
    emailDesignList,
    previewEmail,
    fetchPreview,
    onDelete,
    onEdit,
    t,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState(rule.email_design);

  useEffect(() => {
    fetchPreview(selectedEmailId);
  }, [fetchPreview, selectedEmailId]);

  const showEdit = () => {
    setIsEditing(true);
  };

  const showDelete = () => {
    setIsDeleting(true);
  };

  const handleFetchPreview = (id: number) => {
    setSelectedEmailId(id);
    fetchPreview(id);
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleting(false);
  };

  const handleEdit = (data: Omit<FranchiseCompleteNotificationRule, 'id'>) => {
    onEdit(data);
    setIsEditing(false);
  };

  return (
    <div>
      <div className={classes.row}>
        <Typography variant="h6">{rule.title}</Typography>
        <div>
          <IconButton color="primary" onClick={showEdit}>
            <EditIcon />
          </IconButton>
          <IconButton color="default" onClick={showDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
      <Paper className={classes.card}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" className={classes.grey}>
              {t('franchise.card.parameters')}
            </Typography>
            <Typography variant="body1">
              {rule.is_active
                ? t('franchise.card.activated')
                : t('franchise.card.deactivated')}
            </Typography>
            {rule.send_franchisor_carbon_copy && (
              <Typography variant="body1">
                {t('franchise.card.carbonCopy')}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" className={classes.grey}>
              {t('franchise.card.template')}
            </Typography>
            <div>
              <IconButton
                className={classes.showEmail}
                color="primary"
                onClick={() => {
                  setShowPreview(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>
              {
                emailDesignList?.find(
                  (email) => email.id === rule?.email_design,
                )?.title
              }
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className={classes.grey}>
              {t('franchise.card.companies')}
            </Typography>
            <div className={classes.companyList}>
              {companies
                .filter((c) => rule.companies.includes(c.id))
                .map((company) => (
                  <CompanyChip key={company.id} company={company} />
                ))}
            </div>
          </Grid>
        </Grid>
      </Paper>

      {isEditing && (
        <FranchiseNotificationRuleFormModal
          open
          rule={rule}
          companies={companies}
          emailTemplates={emailDesignList}
          onSubmit={handleEdit}
          onClose={() => setIsEditing(false)}
          notification_event={rule.notification_event}
          previewEmail={previewEmail?.[selectedEmailId]}
          refreshEmailPreview={handleFetchPreview}
        />
      )}
      {showPreview && previewEmail?.[rule?.email_design] && (
        <Dialog open>
          <div
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html: previewEmail?.[rule.email_design]?.html,
            }}
          />
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>
              {t('franchise.form.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isDeleting && (
        <Dialog open>
          <DialogTitle>{t('franchise.delete.title')}</DialogTitle>
          <DialogContent>{t('franchise.delete.content')}</DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleting(false)}>
              {t('franchise.form.cancel')}
            </Button>
            <Button color="primary" onClick={handleDelete}>
              {t('franchise.delete.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    companyList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
    },
    grey: {
      color: theme.palette.grey[500],
      marginBottom: theme.spacing(1),
    },
    card: {
      padding: theme.spacing(2),
    },
    showEmail: {
      marginRight: theme.spacing(1),
      padding: 0,
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['notificationRule']),
)(FranchiseNotificationRuleCard);
