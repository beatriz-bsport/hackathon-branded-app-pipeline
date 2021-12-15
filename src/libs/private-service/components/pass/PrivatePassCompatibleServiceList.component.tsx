import React from 'react';
import { compose, withState } from 'recompose';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

import { PrivateServiceListItem } from '../service/PrivateServiceListItem.component';
import { PrivateSlotCompatibleServiceForm } from '../slot/PrivateSlotCompatibleServiceForm.component';
import { PrivateServiceSelector } from '../service/PrivateServiceSelector.component';
import { filterPrivateService } from '../../utils';

import type {
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
  PrivatePassWithDetailedPrivateServices,
  PrivateService,
} from '../../types';

type Props = {
  pass: PrivatePassWithDetailedPrivateServices;
  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass: Array<ServiceCompatibilityPass>;
  isManager: boolean;

  deleteCompatibleServicePass?: (
    passId: number,
    privateServiceId: number,
  ) => void;
  createCompatibleServicePass?: (
    passId: number,
    privateServiceId: number,
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => void;
  updateCompatibleServicePass?: (
    passId: number,
    serviceId: number,
    data: any,
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => void;

  selectedService: PrivateService;
  setSelectedService: (ps: PrivateService) => void;
  openDeleteCompatibilityDialog: number | null;
  setOpenDeleteCompatibilityDialog: (id: number | null) => void;
};

export const PrivatePassCompatibleServiceList: React.FC<Props> = (props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();

  const { pass, privateServices, compatibleServicePass, isManager } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.horizontalBlock}>
        <div className={classes.detailInfo}>
          <div className={classes.detailCategory}>
            <DoneAllIcon className={classes.leftIcon} />
            <Typography variant="h6">
              {t('privatePass.detailTitles.privateServiceCompatibility')}
            </Typography>
          </div>

          <List>
            {pass.private_services
              .filter((ps: PrivateService) => !!ps)
              .filter((ps: PrivateService) => ps.available)
              .map((ps: PrivateService) => (
                <PrivateServiceListItem
                  hideSecondary
                  privateService={ps}
                  key={ps.id}
                  onDelete={() => props.setOpenDeleteCompatibilityDialog(ps.id)}
                  onEdit={
                    compatibleServicePass && props.updateCompatibleServicePass
                      ? () => props.setSelectedService(ps)
                      : null
                  }
                  compatibilityByService={
                    compatibleServicePass &&
                    compatibleServicePass.find(
                      (c) => c.private_service.id === ps.id,
                    )
                  }
                  classes={classes}
                  t={t}
                />
              ))}

            {!pass.private_services?.length && (
              <ListItem
                divider
                alignItems="center"
                className={classes.emptyListItem}
              >
                <ReportProblemIcon className={classes.reportProblemIcon} />
                <ListItemText
                  primary={
                    <div>
                      <Typography variant="subtitle2">
                        {t('privatePass.compatibleServices.isEmpty')}
                      </Typography>
                      <Typography variant="body2">
                        {t('privatePass.compatibleServices.unusable')}
                      </Typography>
                    </div>
                  }
                />
              </ListItem>
            )}
          </List>

          {isManager && (
            <>
              <div className={classes.privateServiceSelector}>
                <PrivateServiceSelector
                  privateServices={privateServices
                    .filter((ps) =>
                      filterPrivateService(ps, compatibleServicePass, false),
                    )
                    .filter((ps) => ps.available)}
                  onChange={(data: number) =>
                    props.createCompatibleServicePass(props.pass.id, data)
                  }
                  placeholder={t('privatePass.form.selector.privateService')}
                />
              </div>

              <Dialog
                open={!!props.selectedService && !!props.compatibleServicePass}
              >
                <DialogTitle>
                  {t('privateServiceCompatibility.excludedSlots.title', {
                    service:
                      props.selectedService && props.selectedService.name,
                  })}
                </DialogTitle>
                <DialogContent>
                  <PrivateSlotCompatibleServiceForm
                    compatiblePassByService={
                      props.compatibleServicePass &&
                      props.compatibleServicePass.find(
                        (c) =>
                          props.selectedService &&
                          c.private_service.id === props.selectedService.id,
                      )
                    }
                    onSubmit={(data: { excluded_slot_ids: number[] }) =>
                      props.updateCompatibleServicePass(
                        props.pass.id,
                        props.selectedService.id,
                        data,
                        {
                          onSuccess: () => props.setSelectedService(null),
                        },
                      )
                    }
                    onCancel={() => props.setSelectedService(null)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={!!props.openDeleteCompatibilityDialog}>
                <DialogTitle>
                  {t('privateServiceCompatibility.delete.title')}
                </DialogTitle>
                <DialogContent>
                  {t('privateServiceCompatibility.delete.explain')}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      props.setOpenDeleteCompatibilityDialog(null);
                    }}
                  >
                    {t('privateServiceCompatibility.delete.cancel')}
                  </Button>
                  <Button
                    onClick={() => {
                      props.deleteCompatibleServicePass(
                        props.pass.id,
                        props.openDeleteCompatibilityDialog,
                      );
                      props.setOpenDeleteCompatibilityDialog(null);
                    }}
                  >
                    {t('privateServiceCompatibility.delete.submit')}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    fontWeight: 300,
  },
  detailInfo: {
    marginBottom: theme.spacing(2),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  price: {
    fontWeight: 700,
  },
  privateServiceSelector: {
    marginTop: theme.spacing(1),
    maxWidth: 500,
  },
  reportProblemIcon: {
    color: '#E35D4D',
    fontSize: 32,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  emptyListItem: {
    borderLeft: '5px solid',
    borderLeftColor: '#E35D4D',
    boxShadow: '0px 1px 3px 0.3px rgba(0, 0, 0, 0.25)',
  },
}));

export default compose(
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibilityDialog',
    false,
  ),
  withState('selectedService', 'setSelectedService', null),
)(PrivatePassCompatibleServiceList);
