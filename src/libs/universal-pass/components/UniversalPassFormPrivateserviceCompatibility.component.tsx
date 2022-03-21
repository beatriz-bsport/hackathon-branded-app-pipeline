import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { useFormikContext, FieldArray, FormikProps } from 'formik';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Typography from '@material-ui/core/Typography';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import PrivateServiceSelector from '#libs/private-service/components/service/PrivateServiceSelector.component';
import PrivateServiceListItem from '#libs/private-service/components/service/PrivateServiceListItem.component';
import type {
  PrivateServiceWithSlots,
  PrivateSlot,
  CompatiblePrivateService,
  PrivatePass,
  ServiceCompatibilityPass,
} from '#libs/private-service/types';
import { filterPrivateService } from '#libs/private-service/utils';
import { PrivateSlotSelectionDialog } from '#libs/private-service/components//slot/PrivateSlotSelectionDialog.component';
import { PaymentPackFormValues, PaymentPack } from '../../payment-packs/types';

const getExcludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): number[] => {
  const ps_cps: CompatiblePrivateService = cps.find(
    (cps_elt) => cps_elt.private_service === ps.id,
  );
  return ps_cps.excluded_slot_ids;
};

const getIncludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): PrivateSlot[] => {
  const excluded_slots = getExcludedSlots(ps, cps);
  return excluded_slots?.length
    ? ps.slots.filter((slot) => !excluded_slots.includes(slot.id))
    : ps.slots;
};

type Props = {
  field_name: string;
  privateServices: Array<PrivateServiceWithSlots>;
  initial: PaymentPack<PrivatePass>;
  compatibleServicePass: Array<ServiceCompatibilityPass>;
};
export const UniversalPassFormPrivateserviceCompatibility = (props: Props) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  const { privateServices } = props;

  const { values }: FormikProps<PaymentPackFormValues> = useFormikContext();
  const [selectedService, setSelectedService] =
    React.useState<PrivateServiceWithSlots | null>(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = React.useState<
    number | null
  >(null);
  const [openDeleteCompatibilityDialog, setOpenDeleteCompatibilityDialog] =
    React.useState<boolean>(false);
  const setServiceAndIndex = (ps: PrivateServiceWithSlots, index: number) => {
    setSelectedService(ps);
    setSelectedServiceIndex(index);
  };

  const updateSlotData = (
    data: {
      excluded_slot_ids: number[];
    },
    replace: { (index: number, value: any): void },
  ) => {
    replace(selectedServiceIndex, {
      private_service: selectedService.id,
      excluded_slot_ids: data.excluded_slot_ids,
    });
    setServiceAndIndex(null, null);
  };

  return (
    <>
      <div className={classes.flexRowCenter}>
        <DoneAllIcon className={classes.iconLeft} />
        <Typography variant="h6">
          {t('privatePass.form.categoryTitle.compatibilityAppointment')}
        </Typography>
      </div>

      <div className={classes.fieldBlock}>
        <FieldArray {...props} name={props.field_name}>
          {({ remove, push, replace }) => {
            return (
              <>
                <div className={classes.privateServiceSelector}>
                  <PrivateServiceSelector
                    privateServices={privateServices
                      .filter((ps: PrivateServiceWithSlots) =>
                        filterPrivateService(
                          ps,
                          values.linked_private_pass_compatibility,
                          false,
                        ),
                      )
                      .filter((ps) => ps.available)}
                    onChange={(e: any) =>
                      push({ private_service: e, excluded_slot_ids: [] })
                    }
                    placeholder={t('privatePass.form.selector.privateService')}
                  />
                </div>
                <List>
                  {!!values.linked_private_pass_compatibility?.length &&
                    privateServices
                      .filter((ps: PrivateServiceWithSlots) =>
                        filterPrivateService(
                          ps,
                          values.linked_private_pass_compatibility,
                          true,
                        ),
                      )
                      .filter((ps) => ps.available)
                      .map((ps) => (
                        <PrivateServiceListItem
                          hideSecondary
                          privateService={ps}
                          key={ps.id}
                          onDelete={() => {
                            const psArray: number[] =
                              props.initial &&
                              props.initial?.linked_private_pass_compatibility
                                ?.length
                                ? props.initial.linked_private_pass_compatibility.map(
                                    (p_s) => p_s.private_service,
                                  )
                                : [];
                            const psListForIndex: number[] =
                              values.linked_private_pass_compatibility?.map(
                                (p_s: { private_service: any }) =>
                                  p_s.private_service,
                              );
                            if (props.initial && psArray.includes(ps.id)) {
                              setSelectedServiceIndex(
                                psListForIndex.indexOf(ps.id),
                              );
                              setOpenDeleteCompatibilityDialog(true);
                            } else {
                              remove(psListForIndex.indexOf(ps.id));
                            }
                          }}
                          onEdit={() => {
                            if (props.compatibleServicePass) {
                              const psListForIndex: number[] =
                                values.linked_private_pass_compatibility?.map(
                                  (p_s: { private_service: any }) =>
                                    p_s.private_service,
                                );
                              setServiceAndIndex(
                                ps,
                                psListForIndex.indexOf(ps.id),
                              );
                            }
                          }}
                          excluded_slots={getExcludedSlots(
                            ps,
                            values.linked_private_pass_compatibility,
                          )}
                          included_slots={getIncludedSlots(
                            ps,
                            values.linked_private_pass_compatibility,
                          )}
                        />
                      ))}

                  {!values.linked_private_pass_compatibility.length && (
                    <ListItem
                      divider
                      alignItems="center"
                      className={classes.emptyListItem}
                    >
                      <ReportProblemIcon
                        className={classes.reportProblemIcon}
                      />
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
                <PrivateSlotSelectionDialog
                  compatibleServicePass={props.compatibleServicePass}
                  compatibility={values.linked_private_pass_compatibility}
                  onSubmit={(data: { excluded_slot_ids: number[] }) =>
                    updateSlotData(data, replace)
                  }
                  onCancel={() => setServiceAndIndex(null, null)}
                  selectedService={selectedService}
                  privateServices={props.privateServices}
                />
                <Dialog open={openDeleteCompatibilityDialog}>
                  <DialogTitle>
                    {t('privateServiceCompatibility.delete.title')}
                  </DialogTitle>
                  <DialogContent>
                    {t('privateServiceCompatibility.delete.explain')}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setSelectedServiceIndex(null);
                        setOpenDeleteCompatibilityDialog(false);
                      }}
                    >
                      {t('privateServiceCompatibility.delete.cancel')}
                    </Button>
                    <Button
                      onClick={() => {
                        remove(selectedServiceIndex);
                        setSelectedServiceIndex(null);
                        setOpenDeleteCompatibilityDialog(false);
                      }}
                    >
                      {t('privateServiceCompatibility.delete.submit')}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            );
          }}
        </FieldArray>
      </div>
    </>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  fieldBlock: {
    marginBottom: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
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
  privateServiceSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: 600,
  },
  row: {
    helperTextError: {
      color: theme.palette.error.main,
    },
  },
}));
export default UniversalPassFormPrivateserviceCompatibility;
