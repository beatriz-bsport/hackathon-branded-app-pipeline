import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

import type { Role, SelectFieldItem } from '../types';

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
};

const Section: React.FC<{ title: string; helpText?: string }> = ({
  children,
  helpText,
  title,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.section}>
      <div className={classes.sectionTitle}>
        <Typography color="textPrimary" variant="body1">
          {title}
        </Typography>
        {!!helpText && (
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            placement="bottom-end"
            title={
              <div>
                <Typography variant="body1">{helpText}</Typography>
              </div>
            }
          >
            <IconButton className={classes.iconButton}>
              <InfoOutlinedIcon htmlColor={theme.palette.info.main} />
            </IconButton>
          </Tooltip>
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
}) => {
  const { t } = useTranslation('role');
  const classes = useStyles();

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
      {hasAccessMonitoringUpsell &&
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
                  inputPlaceholder={t(
                    'forms.user.advancedSettingsModal.accessMonitoring.multilocation.search',
                  )}
                  isLoading={establishmentGroupListLoading}
                  menuPlacement="bottom"
                  name="locations"
                  onChange={handleSelectSite}
                  options={sitesOptions}
                  placeholder={t(
                    'forms.user.advancedSettingsModal.accessMonitoring.multilocation.placeholder',
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
                    inputPlaceholder={t(
                      'forms.user.advancedSettingsModal.accessMonitoring.singlelocation.search',
                    )}
                    isLoading={establishmentGroupListLoading}
                    menuPlacement="bottom"
                    name="addresses"
                    onChange={handleSelectSite}
                    options={sitesOptions}
                    placeholder={t(
                      'forms.user.advancedSettingsModal.accessMonitoring.singlelocation.placeholder',
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
                inputPlaceholder={t(
                  'forms.user.advancedSettingsModal.accessMonitoring.establishment.search',
                )}
                isDisabled={!selectedSite}
                isLoading={establishmentListLoading}
                menuPlacement="bottom"
                name="coaches"
                onChange={handleSelectEstablishments}
                options={establishmentOptions}
                placeholder={t(
                  'forms.user.advancedSettingsModal.accessMonitoring.establishment.placeholder',
                )}
                value={selectedEstablishments}
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
  tooltip: {
    borderColor: theme.palette.info.main,
    color: theme.palette.text.primary,
    backgroundColor: 'white',
    border: '3px solid',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    width: 400,
    boxShadow: '0px 0px 12px rgba(121.84, 121.84, 121.84, 0.35)',
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
