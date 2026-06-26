import React from 'react';
import { useTranslation } from 'react-i18next';
import { captureMessage } from '@sentry/react';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import TimeoutButton from '#src/components/button/TimeoutButton.component';
import type {
  StripeCompanyComplianceRequirementField,
  StripeCompanyComplianceStatus,
} from '#src/libs/company/types';
import { formatAsDatetimeAdapted } from '#src/utils/datetime';

const BSPORT_STRIPE_COMPLIANCE_FAQ_URL =
  'https://intercom.help/bsport-helpcenter/articles/15654292-stripe-verification-required-what-to-do-before-july-16';

type StripeComplianceRequirementGroupKey =
  | 'associatedPerson'
  | 'bankAccountOwnershipDocument'
  | 'beneficialOwnershipDocument'
  | 'businessProfile'
  | 'businessType'
  | 'companyAddress'
  | 'companyDetails'
  | 'companyDirectorshipDeclaration'
  | 'companyDocuments'
  | 'companyOwnershipDeclaration'
  | 'companyTaxId'
  | 'companyVerificationDocument'
  | 'externalAccount'
  | 'individualDetails'
  | 'other'
  | 'statementDescriptor'
  | 'stripeSupportReview';

const getRequirementGroupKey = (
  requirement: StripeCompanyComplianceRequirementField,
): StripeComplianceRequirementGroupKey => {
  if (requirement === 'external_account') return 'externalAccount';
  if (requirement === 'business_type') return 'businessType';
  if (requirement === 'settings.payments.statement_descriptor') {
    return 'statementDescriptor';
  }
  if (requirement.startsWith('business_profile.')) return 'businessProfile';
  if (requirement.startsWith('company.address.')) return 'companyAddress';
  if (requirement === 'company.verification.document') {
    return 'companyVerificationDocument';
  }
  if (requirement === 'company.tax_id') return 'companyTaxId';
  if (
    ['company.name', 'company.phone', 'company.structure'].includes(requirement)
  ) {
    return 'companyDetails';
  }
  if (requirement.startsWith('company.directorship_declaration.')) {
    return 'companyDirectorshipDeclaration';
  }
  if (requirement.startsWith('company.ownership_declaration.')) {
    return 'companyOwnershipDeclaration';
  }
  if (requirement === 'documents.bank_account_ownership_verification.files') {
    return 'bankAccountOwnershipDocument';
  }
  if (
    requirement === 'documents.proof_of_ultimate_beneficial_ownership.files'
  ) {
    return 'beneficialOwnershipDocument';
  }
  if (requirement.startsWith('documents.')) return 'companyDocuments';
  if (requirement.startsWith('individual.')) return 'individualDetails';
  if (requirement.startsWith('person_') || requirement === 'person_*') {
    return 'associatedPerson';
  }
  if (requirement.startsWith('relationship.')) return 'associatedPerson';
  if (requirement.startsWith('interv_')) return 'stripeSupportReview';

  return 'other';
};

const getRequirementGroupKeys = (
  requirements: StripeCompanyComplianceRequirementField[],
) => Array.from(new Set(requirements.map(getRequirementGroupKey)));

const getUnhandledRequirementFields = (
  requirements: StripeCompanyComplianceRequirementField[],
) =>
  requirements.filter(
    (requirement) => getRequirementGroupKey(requirement) === 'other',
  );

type StripeComplianceStatusModalProps = {
  complianceStatus: StripeCompanyComplianceStatus;
  cancel?: () => void;
  goNext: () => void;
};

export const StripeComplianceStatusModal: React.FC<
  StripeComplianceStatusModalProps
> = ({ complianceStatus, cancel, goNext }) => {
  const { t } = useTranslation(['navigation', 'common']);
  const classes = useStyles();
  const translationStatus =
    complianceStatus.status === 'restricted' ? 'restricted' : 'restrictedSoon';
  const date = complianceStatus.restricted_on || complianceStatus.due_date;
  const formattedDate = date ? formatAsDatetimeAdapted(date, 'DDD') : null;
  const descriptionKey =
    translationStatus === 'restrictedSoon' && !formattedDate
      ? 'stripeCompliance.modal.restrictedSoon.descriptionWithoutDate'
      : `stripeCompliance.modal.${translationStatus}.description`;
  const requirementGroupKeys = React.useMemo(
    () => getRequirementGroupKeys(complianceStatus.requirement_fields),
    [complianceStatus.requirement_fields],
  );
  const unhandledRequirementFields = React.useMemo(
    () => getUnhandledRequirementFields(complianceStatus.requirement_fields),
    [complianceStatus.requirement_fields],
  );

  React.useEffect(() => {
    if (unhandledRequirementFields.length === 0) return;

    captureMessage('Unhandled Stripe compliance requirement fields', {
      extra: {
        requirement_fields: unhandledRequirementFields,
        snapshot_id: complianceStatus.snapshot_id,
        status: complianceStatus.status,
        requirement_scope: complianceStatus.requirement_scope,
      },
      level: 'warning',
    });
  }, [
    complianceStatus.requirement_scope,
    complianceStatus.snapshot_id,
    complianceStatus.status,
    unhandledRequirementFields,
  ]);

  return (
    <>
      <Typography className={classes.title} variant="h5">
        {t(`stripeCompliance.modal.${translationStatus}.title`)}
      </Typography>
      <Typography className={classes.content}>
        {t(descriptionKey, { date: formattedDate })}
      </Typography>
      <Typography className={classes.content}>
        {t('stripeCompliance.modal.genericImpact')}
      </Typography>
      {requirementGroupKeys.length > 0 && (
        <>
          <Typography className={classes.requirementTitle}>
            {t('stripeCompliance.modal.requirements.title')}
          </Typography>
          <ul className={classes.requirementList}>
            {requirementGroupKeys.map((requirementGroupKey) => (
              <Typography
                key={requirementGroupKey}
                className={classes.requirementItem}
                component="li"
              >
                {t(
                  `stripeCompliance.modal.requirements.${requirementGroupKey}`,
                )}
                {requirementGroupKey === 'other' &&
                  unhandledRequirementFields.length > 0 && (
                    <span className={classes.rawRequirementFields}>
                      {unhandledRequirementFields.join(', ')}
                    </span>
                  )}
              </Typography>
            ))}
          </ul>
          <Typography className={classes.faqLinkContainer}>
            <a
              className={classes.faqLink}
              href={BSPORT_STRIPE_COMPLIANCE_FAQ_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('stripeCompliance.modal.faqLink')}
            </a>
          </Typography>
        </>
      )}

      <div className={classes.actions}>
        {cancel && (
          <TimeoutButton delayBeforeActivation={15} onClick={cancel}>
            {t('common:close')}
          </TimeoutButton>
        )}
        <Button color="primary" onClick={goNext} variant="contained">
          {t(`stripeCompliance.cta.${complianceStatus.cta.kind}`)}
        </Button>
      </div>
    </>
  );
};

type StripeComplianceStatusBannerProps = {
  complianceStatus: StripeCompanyComplianceStatus;
  onClick: () => void;
};

export const StripeComplianceStatusBanner: React.FC<
  StripeComplianceStatusBannerProps
> = ({ complianceStatus, onClick }) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles();
  const formattedDate = complianceStatus.due_date
    ? formatAsDatetimeAdapted(complianceStatus.due_date, 'DDD')
    : null;

  return (
    <div className={classes.bannerContainer}>
      <ButtonBase className={classes.banner} onClick={onClick}>
        <div className={classes.bannerText}>
          <WarningIcon fontSize="small" />
          <Typography align="left" variant="caption">
            {t(
              formattedDate
                ? 'stripeCompliance.banner'
                : 'stripeCompliance.bannerWithoutDate',
              { date: formattedDate },
            )}
          </Typography>
        </div>
      </ButtonBase>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  title: { padding: theme.spacing(4) },
  content: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  requirementTitle: {
    fontWeight: 600,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  requirementList: {
    listStylePosition: 'outside',
    listStyleType: 'disc',
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(4),
  },
  requirementItem: {
    display: 'list-item',
    lineHeight: 1.4,
    paddingBottom: theme.spacing(0.75),
    paddingLeft: theme.spacing(0.5),
  },
  rawRequirementFields: {
    display: 'block',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: theme.spacing(0.5),
    wordBreak: 'break-word',
  },
  faqLinkContainer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
  },
  faqLink: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  actions: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    gap: theme.spacing(1),
  },
  bannerContainer: {
    left: 0,
    right: 0,
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    paddingBottom: theme.spacing(2),
    zIndex: 999,
  },
  banner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.dark,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  bannerText: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
}));
