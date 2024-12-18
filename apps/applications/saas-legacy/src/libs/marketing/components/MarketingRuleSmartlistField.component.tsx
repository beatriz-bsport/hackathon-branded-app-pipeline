import React, { useState } from 'react';

import {
  Button,
  Typography,
  Collapse,
  Divider,
  Grid,
  ButtonBase,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import WarningIcon from '@material-ui/icons/Warning';
// @ts-expect-error
import { OptionTypeBase } from 'react-select';
import { MaterialUiMultiSelectorField } from '#src/libs/custom-form/components/GenericFormik.input';
import { SmartList } from '#src/libs/smart-list/types';

type Props = {
  smartLists: SmartList[];
  smartlist_include: Array<number>;
  smartlist_exclude: Array<number>;
  goToSmartList: () => void;
};

const MarketingRuleSmartlistField = (props: Props) => {
  const { smartLists, smartlist_include, smartlist_exclude, goToSmartList } =
    props;

  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const smartListSelectOptions: Array<OptionTypeBase> = smartLists?.map(
    (sm) => ({
      label: sm.name,
      value: sm.id,
    }),
  );
  const [openAdvancedOptions, setOpenAdvancedOptions] = useState(false);

  return (
    <div>
      <Divider className={classes.divider} />
      <div className={classes.advancedOptionsSection}>
        <Grid container spacing={4}>
          <div className={classes.row}>
            <ButtonBase
              className={classes.advancedOptionsHeader}
              onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
            >
              <div className={classes.rowLeft}>
                <SettingsIcon className={classes.icon} />
                <Typography variant="h6">
                  {t('notificationForm.smartLists.advanced')}
                </Typography>
              </div>
              {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>
          </div>
          <Collapse in={openAdvancedOptions} style={{ width: '100%' }}>
            <div className={classes.smartListSelector}>
              <Typography variant="caption">
                {t('notificationForm.smartLists.smartListHelper')}
              </Typography>
              <MaterialUiMultiSelectorField
                name="smartlist_exclude"
                options={
                  smartListSelectOptions ? [...smartListSelectOptions] : []
                }
                placeholder={t(
                  'notificationForm.smartLists.smartListSelection',
                )}
                // @ts-expect-error
                value={smartListSelectOptions?.filter((opt) =>
                  smartlist_exclude?.includes(opt?.value),
                )}
              />
            </div>
            <div className={classes.smartListSelector}>
              <Typography variant="caption">
                {t('notificationForm.smartLists.smartListHelperInclude')}
              </Typography>
              <MaterialUiMultiSelectorField
                // @ts-expect-error
                isClearable
                isMulti
                name="smartlist_include"
                options={
                  smartListSelectOptions ? [...smartListSelectOptions] : []
                }
                placeholder={t(
                  'notificationForm.smartLists.smartListSelection',
                )}
                value={smartListSelectOptions?.filter((opt) =>
                  smartlist_include?.includes(opt?.value),
                )}
              />
            </div>
            {!smartlist_include.length && !smartlist_exclude.length && (
              <div className={classes.warningContainerSmartlist}>
                <div className={classes.leftWarningContainerSmartlist}>
                  <WarningIcon className={classes.warningIcon} />
                  <Typography
                    className={classes.warningContent}
                    variant="body2"
                  >
                    {t('notificationForm.smartLists.warning')}
                  </Typography>
                </div>
                <Button
                  className={classes.createSmartList}
                  onClick={goToSmartList}
                  variant="outlined"
                >
                  {t('notificationForm.smartLists.createSmartList')}
                </Button>
              </div>
            )}
          </Collapse>
        </Grid>
      </div>
      <Divider className={classes.divider} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: theme.spacing(20),
  },
  flex: {
    display: 'flex',
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },

  smartListSelector: {
    marginTop: theme.spacing(2),
  },
  warningContainerSmartlist: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    justifyContent: 'space-between',
  },
  leftWarningContainerSmartlist: {
    display: 'flex',
    alignItems: 'center',
  },
  warningContent: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
    color: theme.palette.warning.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  createSmartList: {
    borderColor: theme.palette.warning.main,
    color: theme.palette.warning.main,
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },
  row: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    color: '#868686',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  advancedOptionsSection: {
    paddingTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  rowLeft: { display: 'flex', gap: theme.spacing(2), alignItems: 'center' },
  advancedOptionsHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default MarketingRuleSmartlistField;
