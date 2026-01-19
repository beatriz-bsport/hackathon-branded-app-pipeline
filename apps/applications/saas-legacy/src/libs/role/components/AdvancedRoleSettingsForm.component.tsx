import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import InformationIcon from '#src/components/InformationIcon';

import type { Role, SelectFieldItem } from '../types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import { RoleType } from '@bsport/common/lib/master-data/user-role';
import COMMON_ROLES, {
  ADMIN_ROLE,
  STAFF_ROLE,
  // @ts-expect-error
} from '#src/libs/role/role-types';

type Props = {
  coachListLoading: boolean;
  coachOptions: SelectFieldItem[];
  establishmentGroupListLoading?: boolean;
  establishmentListLoading?: boolean;
  establishmentOptions: SelectFieldItem[];
  handleSelectCoaches: (values: SelectFieldItem[]) => void;
  handleSelectEstablishments: (values: SelectFieldItem[]) => void;
  handleSelectSite: (values: SelectFieldItem) => void;
  hasAccessMonitoringUpsell: boolean;
  hasMultiLocationUpsell: boolean;
  customRole: Role;
  selectedCoaches: SelectFieldItem[];
  selectedEstablishments: SelectFieldItem[];
  selectedSite: SelectFieldItem;
  sitesOptions: SelectFieldItem[];
  withTitle?: boolean;
  showOnlyBillingGroup?: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  selectedEstablishmentBillingGroup: SelectFieldItem | null;
  establishmentBillingGroupOptions: SelectFieldItem[];
  handleSelectEstablishmentBillingGroup: (value: SelectFieldItem) => void;
};

const Section: React.FC<{ title: string; helpText?: string }> = ({
  children,
  helpText,
  title,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.sectionTitle}>
        <Typography color="textPrimary" variant="body1">
          {title}
        </Typography>
        {!!helpText && (
          <InformationIcon
            anchorOrigin="top-right"
            text={helpText}
            transformOrigin="bottom-right"
          />
        )}
      </div>
      {children}
    </div>
  );
};

const AdvancedRoleSettingsForm: React.FC<Props> = ({
  coachListLoading,
  coachOptions,
  establishmentGroupListLoading,
  establishmentListLoading,
  establishmentOptions,
  handleSelectCoaches,
  handleSelectEstablishments,
  handleSelectSite,
  hasAccessMonitoringUpsell,
  hasMultiLocationUpsell,
  customRole,
  selectedCoaches,
  selectedEstablishments,
  selectedSite,
  sitesOptions,
  withTitle,
  showOnlyBillingGroup = false,
  establishmentBillingGroups,
  selectedEstablishmentBillingGroup,
  establishmentBillingGroupOptions,
  handleSelectEstablishmentBillingGroup,
}) => {
  const { t } = useTranslation('role');
  const classes = useStyles();

  // Check if the billing group field should be shown for this role
  // It should be shown for: custom roles, Admin (4), Check-in | Wide (1), and POS (-1)
  // It should NOT be shown for: Owner (0), Check-in | Limited (2), Check-in | Tablet (3)
  const shouldShowBillingGroup =
    !!establishmentBillingGroups?.length &&
    customRole &&
    (customRole.id === ADMIN_ROLE ||
      customRole.id === STAFF_ROLE ||
      customRole.id === RoleType.USER_ROLE_QUICKSALE ||
      !Object.values(COMMON_ROLES).includes(customRole.id));

  // Check if the billing group is required (only for POS role)
  const isBillingGroupRequired =
    customRole?.id === RoleType.USER_ROLE_QUICKSALE;

  return (
    <div className={classes.root}>
      {withTitle && (
        <div className={classes.titleContainer}>
          <FilterListIcon />
          <Typography variant="h6">
            {t('forms.user.advancedSettingsModal.title')}
          </Typography>
        </div>
      )}
      {!showOnlyBillingGroup && (
        <Section
          helpText={t('forms.user.advancedSettingsModal.teacher.helpText')}
          title={t('forms.user.advancedSettingsModal.teacher.title')}
        >
          <div className={classes.selectorField}>
            <Typography className={classes.textSecondary} variant="body2">
              {t('forms.user.advancedSettingsModal.teacher.subtitle')}
            </Typography>
            <MaterialUISelector
              isMulti
              withoutPortal
              allOptionsPlaceholder={t(
                'forms.user.advancedSettingsModal.teacher.allOptionsPlaceholder',
              )}
              defaultNumberShown={2}
              isLoading={coachListLoading}
              menuPlacement="bottom"
              name="coaches"
              onChange={handleSelectCoaches}
              options={coachOptions}
              placeholder={t(
                'forms.user.advancedSettingsModal.teacher.placeholder',
              )}
              value={selectedCoaches}
            />
            <Typography color="textSecondary" variant="caption">
              {t('forms.user.ifEmptySelectAll')}
            </Typography>
          </div>
        </Section>
      )}
      {!showOnlyBillingGroup &&
        hasAccessMonitoringUpsell &&
        customRole?.permissions?.navigationMenu?.accessMonitoring?.perform && (
          <Section
            helpText={
              hasMultiLocationUpsell
                ? t(
                    'forms.user.advancedSettingsModal.accessMonitoring.multilocation.helpText',
                  )
                : t(
                    'forms.user.advancedSettingsModal.accessMonitoring.singlelocation.helpText',
                  )
            }
            title={t('forms.user.advancedSettingsModal.accessMonitoring.title')}
          >
            {hasMultiLocationUpsell ? (
              <div className={classes.selectorField}>
                <Typography className={classes.textSecondary} variant="body2">
                  {t(
                    'forms.user.advancedSettingsModal.accessMonitoring.multilocation.title',
                  )}
                </Typography>
                <MaterialUISelector
                  isClearable
                  isSearchable
                  withoutPortal
                  defaultNumberShown={2}
                  isLoading={establishmentGroupListLoading}
                  menuPlacement="bottom"
                  name="locations"
                  onChange={handleSelectSite}
                  options={sitesOptions}
                  placeholder={t(
                    'forms.user.advancedSettingsModal.accessMonitoring.multilocation.placeholder',
                  )}
                  searchPlaceholder={t(
                    'forms.user.advancedSettingsModal.accessMonitoring.multilocation.search',
                  )}
                  value={selectedSite}
                />
              </div>
            ) : (
              (sitesOptions?.length !== 1 || !selectedSite) && (
                <div className={classes.selectorField}>
                  <Typography className={classes.textSecondary} variant="body2">
                    {t(
                      'forms.user.advancedSettingsModal.accessMonitoring.singlelocation.title',
                    )}
                  </Typography>
                  <MaterialUISelector
                    isClearable
                    isSearchable
                    withoutPortal
                    defaultNumberShown={2}
                    isLoading={establishmentGroupListLoading}
                    menuPlacement="bottom"
                    name="addresses"
                    onChange={handleSelectSite}
                    options={sitesOptions}
                    placeholder={t(
                      'forms.user.advancedSettingsModal.accessMonitoring.singlelocation.placeholder',
                    )}
                    searchPlaceholder={t(
                      'forms.user.advancedSettingsModal.accessMonitoring.singlelocation.search',
                    )}
                    value={selectedSite}
                  />
                </div>
              )
            )}
            <div className={classes.selectorField}>
              <Typography className={classes.textSecondary} variant="body2">
                {t(
                  'forms.user.advancedSettingsModal.accessMonitoring.establishment.title',
                )}
              </Typography>
              <MaterialUISelector
                isClearable
                isMulti
                isSearchable
                withoutPortal
                allOptionsPlaceholder={t(
                  'forms.user.advancedSettingsModal.accessMonitoring.establishment.allOptionsPlaceholder',
                )}
                defaultNumberShown={2}
                isDisabled={!selectedSite}
                isLoading={establishmentListLoading}
                menuPlacement="bottom"
                name="establishments"
                onChange={handleSelectEstablishments}
                options={establishmentOptions}
                placeholder={t(
                  'forms.user.advancedSettingsModal.accessMonitoring.establishment.placeholder',
                )}
                searchPlaceholder={t(
                  'forms.user.advancedSettingsModal.accessMonitoring.establishment.search',
                )}
                value={selectedEstablishments}
              />
            </div>
          </Section>
        )}
      {shouldShowBillingGroup && (
        <Section
          helpText={t(
            'forms.user.advancedSettingsModal.establishmentBillingGroup.helpText',
          )}
          title={
            t(
              'forms.user.advancedSettingsModal.establishmentBillingGroup.title',
            ) + (isBillingGroupRequired ? ' *' : '')
          }
        >
          <div className={classes.selectorField}>
            <MaterialUISelector
              withoutPortal
              isClearable={!isBillingGroupRequired}
              menuPlacement="bottom"
              name="establishmentBillingGroup"
              onChange={handleSelectEstablishmentBillingGroup}
              options={establishmentBillingGroupOptions}
              value={selectedEstablishmentBillingGroup}
            />
          </div>
        </Section>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    selfAlign: 'stretch',
  },
  sectionTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorField: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    minWidth: 500,
  },
  iconButton: {
    padding: theme.spacing(0.5),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

export default React.memo(AdvancedRoleSettingsForm);
