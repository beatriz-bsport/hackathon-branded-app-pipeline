import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { PrivateSlotCompatibleServiceForm } from './PrivateSlotCompatibleServiceForm.component';
import {
  PrivateService,
  ServiceCompatibilityPass,
  CompatiblePrivateService,
  PrivateServiceWithSlots,
} from '../../types';
import { getExcludedSlotsDialogTitle } from '../../utils';

type Props = {
  onSubmit: (data: Object) => void;
  compatibleServicePass: Array<ServiceCompatibilityPass>;
  compatibility: Array<CompatiblePrivateService>;
  onCancel: () => void;
  selectedService: PrivateService;
  privateServices: Array<PrivateServiceWithSlots>;
};

export const PrivateSlotSelectionDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);

  const getCompatiblePassByService = (
    compServicePass: Array<ServiceCompatibilityPass>,
    values: CompatiblePrivateService[],
  ) => {
    if (props.selectedService) {
      const id: number = props.selectedService.id;
      const private_services = values?.length
        ? values.map((ps) => ps.private_service)
        : [];
      const selectedPrivateService = values?.length
        ? values.find((ps) => ps.private_service === id)
        : null;

      if (
        !private_services.includes(id) ||
        (!compServicePass.excluded_slot_ids?.length &&
          !compServicePass.included_slots?.length)
      ) {
        const privateService = props.privateServices.find((ps) => ps.id === id);
        return {
          private_service: privateService,
          excluded_slot_ids: selectedPrivateService?.excluded_slot_ids?.length
            ? selectedPrivateService.excluded_slot_ids
            : [],
          included_slots: selectedPrivateService?.excluded_slot_ids?.length
            ? privateService.slots.filter(
                (slot) =>
                  !selectedPrivateService.excluded_slot_ids.includes(slot.id),
              )
            : privateService.slots,
        };
      }
      if (compServicePass.length) {
        const selectedCompatibleServicePass = compServicePass.find(
          (csp) => csp.private_service.id === id,
        );

        const privateServiceForExcludedSlots = values.find(
          (ps) => ps.private_service === id,
        );
        const compatiblePrivateService = {
          ...selectedCompatibleServicePass,
          excluded_slot_ids: privateServiceForExcludedSlots.excluded_slot_ids
            .length
            ? privateServiceForExcludedSlots.excluded_slot_ids
            : [],
        };
        return compatiblePrivateService;
      }
    }
    return null;
  };

  return (
    <Dialog open={!!props.selectedService && !!props.compatibleServicePass}>
      <DialogTitle>
        {getExcludedSlotsDialogTitle(t, props.selectedService)}
      </DialogTitle>
      <DialogContent>
        <PrivateSlotCompatibleServiceForm
          compatiblePassByService={getCompatiblePassByService(
            props.compatibleServicePass,
            props.compatibility,
          )}
          onSubmit={(data: Object) => props.onSubmit(data)}
          onCancel={props.onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PrivateSlotSelectionDialog;
