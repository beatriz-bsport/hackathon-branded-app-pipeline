import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, MenuItem } from '@material-ui/core';
import MaterialUISelector, {
  type ItemRendererProps,
} from '#src/components/Selector/MaterialUISelector.component';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PassPreviewData } from './types';
import { toPassPreviewData } from './utils';
import { PassPreview } from './PassPreview.component';

type MaterialUISelectorPassesProps = {
  disabled?: boolean;
  onConfirm?: () => void;
  passes: PaymentPack[] | PrivatePass[];
  placeHolder?: string;
  onChange: (passIds: number[]) => void;
  selectedPasses?: number[];
};

const MaterialUISelectorPasses = (props: MaterialUISelectorPassesProps) => {
  const { t } = useTranslation('paymentPack');
  const [selectedPassOptions, setSelectedPassOptions] =
    React.useState<PassPreviewData[]>();

  const onChange = useCallback(
    (passOptions: PassPreviewData[]) => {
      setSelectedPassOptions(passOptions);
      props.onChange(passOptions.map((option) => option.value));
    },
    [props],
  );

  const options: PassPreviewData[] = useMemo(() => {
    return [...props.passes].map((pass) => toPassPreviewData(t, pass));
  }, [props.passes, t]);

  const defaultValue = useMemo(() => {
    if (!props.selectedPasses) return [];
    return options.filter((option) =>
      props.selectedPasses.includes(option.value),
    );
  }, [options, props.selectedPasses]);

  const passOptionRenderer = useCallback(
    ({ data, isSelected }: ItemRendererProps<PassPreviewData>) => (
      <MenuItem dense>
        <Checkbox checked={isSelected} />
        <PassPreview pass={data} />
      </MenuItem>
    ),
    [],
  );

  return (
    <MaterialUISelector
      isMulti
      stopEventPropagationOnClickAway
      closeMenuOnSelect={false}
      defaultValue={defaultValue}
      isDisabled={props.disabled ?? false}
      itemRenderer={passOptionRenderer}
      onChange={onChange}
      onConfirm={props.onConfirm}
      options={options}
      placeholder={props.placeHolder}
      value={props.disabled ? null : selectedPassOptions}
    />
  );
};

export default React.memo(MaterialUISelectorPasses);
